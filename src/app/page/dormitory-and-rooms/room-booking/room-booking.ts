import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Dormitory } from '../../../services/api/dormitory/dormitory';
import { ChangeDetectorRef } from '@angular/core';
import { HeaderOwner } from '../../Dashboards/header-owner/header-owner';

interface Room {
  id: number;
  number: string;
  price: number;
  selected: boolean;
  status: string;
  room_type_name?: string;
}

interface Floor {
  number: number;
  rooms: Room[];
}

@Component({
  selector: 'app-room-booking',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderOwner],
  templateUrl: './room-booking.html',
  styleUrl: './room-booking.scss',
})
export class RoomBooking implements OnInit {
  isSettingsMenuOpen = false;
  isMenuOpen = false;

  dormId: number | null = null;

  floors: Floor[] = [];
  filteredFloors: Floor[] = [];

  selectAll = false;
  isLoading = false;

  searchTerm = '';
  selectedStatus = 'all';
  selectedFloorFilter = 'all';

  roomTypes: any[] = [];
  selectedTypeId: number | null = null;
  showTypeModal: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dormitoryService: Dormitory,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('dormId');

      if (id) {
        this.dormId = +id;
        this.fetchRooms();
        this.fetchRoomTypes();
      } else {
        this.fetchDefaultDormRooms();
      }
    });
  }

  fetchDefaultDormRooms() {
    this.isLoading = true;

    this.dormitoryService.getMyDormitories().subscribe({
      next: (response) => {

        const dorms = Array.isArray(response?.data)
          ? response.data
          : response?.data
            ? [response.data]
            : [];

        const firstDormId = dorms[0]?.id;

        if (firstDormId) {
          this.dormId = Number(firstDormId);
          this.fetchRooms();
          return;
        }

        this.isLoading = false;
        this.floors = [];
        this.filteredFloors = [];
      },

      error: (err) => {
        console.error('Failed to load dormitories', err);
        this.isLoading = false;
        this.floors = [];
        this.filteredFloors = [];
      }
    });
  }

  fetchRooms() {

    if (!this.dormId) return;

    this.isLoading = true;

    this.dormitoryService.getRooms(this.dormId).subscribe({

      next: (response) => {

        this.isLoading = false;

        const rooms = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.rooms)
            ? response.data.rooms
            : [];

        if (rooms.length > 0) {
          this.processRooms(rooms);
        } else {
          this.floors = [];
          this.filteredFloors = [];
        }

        this.cd.detectChanges();
      },

      error: (err) => {
        console.error('Failed to load rooms', err);
        this.isLoading = false;
        this.floors = [];
        this.filteredFloors = [];
      }
    });
  }

  processRooms(apiRooms: any[]) {

    const floorMap = new Map<number, Room[]>();

    apiRooms.forEach(room => {

      const floorNumber = Number(room.floor_number ?? 0);

      const newRoom: Room = {
        id: room.id,
        number: String(room.room_number ?? room.number ?? ''),
        price: Number(room.price ?? 0),
        selected: false,
        status: String(room.status ?? 'available'),
        room_type_name: room.room_type_name
      };

      if (!floorMap.has(floorNumber)) {
        floorMap.set(floorNumber, []);
      }

      floorMap.get(floorNumber)!.push(newRoom);

    });

    const floors: Floor[] = [];

    floorMap.forEach((rooms, floorNumber) => {
      floors.push({
        number: floorNumber,
        rooms
      });
    });

    floors.sort((a, b) => a.number - b.number);

    this.floors = floors;

    this.applyFilters();
  }

  applyFilters() {

    let result = this.floors.map(floor => ({
      ...floor,
      rooms: floor.rooms.filter(room => {

        const matchesSearch =
          room.number.toLowerCase().includes(this.searchTerm.toLowerCase());

        const matchesStatus =
          this.selectedStatus === 'all' ||
          room.status === this.selectedStatus;

        return matchesSearch && matchesStatus;
      })
    }));

    if (this.selectedFloorFilter !== 'all') {

      const floorNum = parseInt(this.selectedFloorFilter, 10);

      result = result.filter(floor => floor.number === floorNum);
    }

    this.filteredFloors = result.filter(floor => floor.rooms.length > 0);

    this.checkSelectAll();
  }

  toggleSettingsMenu() {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;

    if (this.isSettingsMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.isSettingsMenuOpen = false;
    }
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }

  toggleAll(event: any) {

    const isChecked = event.target.checked;

    this.selectAll = isChecked;

    this.filteredFloors.forEach(floor => {
      floor.rooms.forEach(room => room.selected = isChecked);
    });
  }

  toggleFloor(floor: Floor, isSelected: boolean) {

    floor.rooms.forEach(room => room.selected = isSelected);

    this.checkSelectAll();
  }

  toggleRoom(room: Room) {

    room.selected = !room.selected;

    this.checkSelectAll();
  }

  checkSelectAll() {

    let allSelected = true;
    let hasRooms = false;

    for (const floor of this.filteredFloors) {

      for (const room of floor.rooms) {

        hasRooms = true;

        if (!room.selected) {
          allSelected = false;
          break;
        }
      }
    }

    this.selectAll = hasRooms ? allSelected : false;
  }

  goBankPage() {
    if (!this.dormId) return;

    this.router.navigate(['/owner/dormitory', this.dormId, 'bank-account']);
  }

  fetchRoomTypes() {
    if (!this.dormId) return;
    this.dormitoryService.getRoomTypes(this.dormId).subscribe({
      next: (res: any) => {
        this.roomTypes = res.data || [];
      }
    });
  }

  openAssignModal() {
    if (this.getSelectedRoomIds().length === 0) {
      alert('กรุณาเลือกห้องที่ต้องการกำหนดค่าเช่า');
      return;
    }
    this.showTypeModal = true;
  }

  getSelectedRoomIds(): number[] {
    const ids: number[] = [];
    this.floors.forEach(f => f.rooms.forEach(r => {
      if (r.selected) ids.push(r.id);
    }));
    return ids;
  }

  applyRoomType() {
    if (!this.dormId || !this.selectedTypeId) {
      alert('กรุณาเลือกประเภทห้อง');
      return;
    }

    this.dormitoryService.assignRoomType(this.dormId, this.getSelectedRoomIds(), this.selectedTypeId).subscribe({
      next: () => {
        this.showTypeModal = false;
        this.fetchRooms();
      },
      error: (err: any) => {
        console.error('Failed to assign room type', err);
        alert('เกิดข้อผิดพลาดในการกำหนดค่าเช่า');
      }
    });
  }
}