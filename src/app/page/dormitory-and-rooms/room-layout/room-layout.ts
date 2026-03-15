import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Dormitory } from '../../../services/api/dormitory/dormitory';
import Swal from 'sweetalert2';
import { HeaderOwner } from '../../Dashboards/header-owner/header-owner';

interface Room {
  id: number;
  room_number: string;
  floor_number: number;
  status: string;
  join_status?: string;
  room_type_name?: string;
  price?: number;
}

interface Floor {
  number: number;
  rooms: Room[];
}

@Component({
  selector: 'app-room-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderOwner],
  templateUrl: './room-layout.html',
  styleUrl: './room-layout.scss',
})
export class RoomLayout implements OnInit {
  isSettingsMenuOpen: boolean = false;
  isMenuOpen: boolean = false;
  isLoading: boolean = false;

  dormId: number | null = null;
  floors: Floor[] = [];
  filteredFloors: Floor[] = [];

  searchTerm: string = '';
  vacantRoomCount: number = 0;
  pendingRoomCount: number = 0;
  occupiedRoomCount: number = 0;
  overdueRoomCount: number = 0;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dormitoryService = inject(Dormitory);
  private cd = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('dormId');
      if (id) {
        this.dormId = +id;
        this.fetchRooms();
      }
    });
  }

  fetchRooms() {
    if (!this.dormId) return;

    this.isLoading = true;
    this.dormitoryService.getRooms(this.dormId).subscribe({
      next: (response) => {
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
          this.vacantRoomCount = 0;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load rooms', err);
        this.isLoading = false;
        this.cd.detectChanges();
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลผังห้องได้',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  processRooms(apiRooms: any[]) {
    const floorMap = new Map<number, Room[]>();
    let vacantCount = 0;
    this.pendingRoomCount = 0;
    this.occupiedRoomCount = 0;

    apiRooms.forEach(room => {
      const floorNumber = Number(room.floor_number ?? 0);
      const newRoom: Room = {
        id: room.id,
        room_number: String(room.room_number ?? room.number ?? ''),
        floor_number: floorNumber,
        status: String(room.status ?? 'available'),
        join_status: String(room.join_status ?? ''),
        room_type_name: room.room_type_name,
        price: room.price
      };

      if (newRoom.join_status === 'pending') {
        this.pendingRoomCount++;
      } else if (newRoom.status === 'occupied') {
        this.occupiedRoomCount++;
      } else if (newRoom.status === 'available') {
        vacantCount++;
      }

      if (!floorMap.has(floorNumber)) {
        floorMap.set(floorNumber, []);
      }
      floorMap.get(floorNumber)!.push(newRoom);
    });

    const floors: Floor[] = [];
    floorMap.forEach((rooms, floorNumber) => {
      floors.push({
        number: floorNumber,
        rooms: rooms.sort((a, b) => a.room_number.localeCompare(b.room_number))
      });
    });

    this.floors = floors.sort((a, b) => a.number - b.number);
    this.vacantRoomCount = vacantCount;
    this.applyFilters();
  }

  applyFilters() {
    if (!this.searchTerm) {
      this.filteredFloors = this.floors;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredFloors = this.floors.map(floor => ({
      ...floor,
      rooms: floor.rooms.filter(room =>
        room.room_number.toLowerCase().includes(term)
      )
    })).filter(floor => floor.rooms.length > 0);
  }

  toggleSettingsMenu() {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToRoomBooking() {
    if (this.dormId) {
      this.router.navigate(['/owner/dormitory', this.dormId, 'room-booking']);
    }
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }

  goToTenantDetails(roomId: number) {
    if (this.dormId) {
      this.router.navigate(['/owner/dormitory', this.dormId, 'room-details', roomId]);
    }
  }

  goBankPage() {
    if (this.dormId) {
      this.router.navigate(['/owner/dormitory', this.dormId, 'bank-account']);
    }
  }
}
