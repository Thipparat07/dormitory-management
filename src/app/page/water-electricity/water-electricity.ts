import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderOwner } from '../Dashboards/header-owner/header-owner';
import { inject, ChangeDetectorRef } from '@angular/core';
import { Dormitory } from '../../services/api/dormitory/dormitory';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

interface Room {
  id: number;
  number: string;
  waterPrice: number;
  electricPrice: number;
  furnitureFee: number;
  selected: boolean;
}

interface Floor {
  number: number;
  rooms: Room[];
}

@Component({
  selector: 'app-water-electricity',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderOwner],
  templateUrl: './water-electricity.html',
  styleUrl: './water-electricity.scss',
})
export class WaterElectricity implements OnInit {
  private route = inject(ActivatedRoute);
  private dormitoryService = inject(Dormitory);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  dormId: string | null = null;
  isLoading: boolean = true;
  isConfigModalOpen: boolean = false;

  floors: Floor[] = [];
  filteredFloors: Floor[] = [];
  selectAll: boolean = false;

  selectedRoomForEdit: Room | null = null;
  editPrice: number | null = null;
  editMinPrice: number | null = null;
  calcMethod: string = 'คิดตามจริง';
  configType: 'water' | 'electric' | 'furniture' = 'water';

  currentWaterRate: number = 0;
  currentElectricRate: number = 0;

  searchTerm: string = '';
  selectedFloorFilter: string = 'all';

  waterCalcMethods = [
    'เหมาจ่ายรายเดือน',
    'เหมาจ่ายรายหัว',
    'คิดตามจริง',
    'คิดตามจริง (ขั้นต่ำเป็นจำนวนเงิน)',
    'คิดตามจริง (ขั้นต่ำเป็นยูนิต)',
    'คิดตามจริง (บวกส่วนต่างจากราคาขั้นต่ำ)'
  ];

  electricCalcMethods = [
    'เหมาจ่ายรายเดือน',
    'คิดตามจริง',
    'คิดตามจริง (ขั้นต่ำเป็นจำนวนเงิน)',
    'คิดตามจริง (ขั้นต่ำเป็นยูนิต)',
    'คิดตามจริง (บวกส่วนต่างจากราคาขั้นต่ำ)'
  ];

  furnitureCalcMethods = [
    'คิดแบบคงที่ต่อเดือน'
  ];

  constructor() { }

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      this.dormId = params['dormId'] || null;
      if (this.dormId) {
        this.fetchData();
      }
    });
  }

  fetchData() {
    if (!this.dormId) return;
    this.isLoading = true;
    this.cdr.detectChanges();

    forkJoin({
      roomsRes: this.dormitoryService.getRooms(Number(this.dormId)),
      utilityRes: this.dormitoryService.getUtility(this.dormId)
    }).subscribe({
      next: (res) => {
        if (res.utilityRes.status === 'success' && res.utilityRes.data) {
          this.currentWaterRate = res.utilityRes.data.water_rate;
          this.currentElectricRate = res.utilityRes.data.electricity_rate;
        }

        if (res.roomsRes.status === 'success' && res.roomsRes.data) {
          this.processRooms(res.roomsRes.data);
        }

        this.isLoading = false;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to fetch utility data', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
        });
      }
    });
  }

  processRooms(rooms: any[]) {
    const floorMap = new Map<number, Room[]>();
    rooms.forEach(r => {
      const room: Room = {
        id: r.id,
        number: r.room_number,
        waterPrice: this.currentWaterRate,
        electricPrice: this.currentElectricRate,
        furnitureFee: Number(r.furniture_fee || 0),
        selected: false
      };
      const floorNum = r.floor_number;
      if (!floorMap.has(floorNum)) {
        floorMap.set(floorNum, []);
      }
      floorMap.get(floorNum)!.push(room);
    });

    const sortedFloors = Array.from(floorMap.keys()).sort((a, b) => a - b);
    this.floors = sortedFloors.map(fNum => ({
      number: fNum,
      rooms: floorMap.get(fNum)!
    }));
  }

  applyGlobalRatesToRooms() {
    this.floors.forEach(f => {
      f.rooms.forEach(r => {
        r.waterPrice = this.currentWaterRate;
        r.electricPrice = this.currentElectricRate;
      });
    });
  }

  applyFilters() {
    let result = this.floors.map(floor => ({
      ...floor,
      rooms: floor.rooms.filter(room => {
        const matchesSearch = room.number.toLowerCase().includes(this.searchTerm.toLowerCase());
        return matchesSearch;
      })
    }));

    if (this.selectedFloorFilter !== 'all') {
      const floorNum = parseInt(this.selectedFloorFilter, 10);
      result = result.filter(floor => floor.number === floorNum);
    }

    this.filteredFloors = result.filter(floor => floor.rooms.length > 0);
    this.checkSelectAll();
    this.cdr.detectChanges();
  }

  toggleSelectAll() {
    this.filteredFloors.forEach(floor => {
      floor.rooms.forEach(room => room.selected = this.selectAll);
    });
  }

  selectFloor(floor: Floor) {
    floor.rooms.forEach(room => room.selected = true);
    this.checkSelectAll();
  }

  deselectFloor(floor: Floor) {
    floor.rooms.forEach(room => room.selected = false);
    this.checkSelectAll();
  }

  toggleRoomSelection(room: Room) {
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

  openConfigModal(type: 'water' | 'electric' | 'furniture', room: Room | 'bulk') {
    if (room === 'bulk') {
      const selectedRooms = this.getSelectedRooms();
      if (selectedRooms.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'แจ้งเตือน',
          text: 'กรุณาเลือกห้องที่ต้องการกำหนดค่า'
        });
        return;
      }
      this.selectedRoomForEdit = null;
      if (type === 'water') this.editPrice = this.currentWaterRate;
      else if (type === 'electric') this.editPrice = this.currentElectricRate;
      else this.editPrice = 0;
    } else {
      room.selected = true;
      this.checkSelectAll();
      this.selectedRoomForEdit = room;
      if (type === 'water') this.editPrice = room.waterPrice;
      else if (type === 'electric') this.editPrice = room.electricPrice;
      else this.editPrice = room.furnitureFee;
    }

    this.configType = type;
    this.calcMethod = type === 'furniture' ? 'คิดแบบคงที่ต่อเดือน' : 'คิดตามจริง';
    this.editMinPrice = 0;
    this.isConfigModalOpen = true;
  }

  getSelectedRooms(): Room[] {
    const selected: Room[] = [];
    this.floors.forEach(f => {
      f.rooms.forEach(r => {
        if (r.selected) selected.push(r);
      });
    });
    return selected;
  }

  closeConfigModal() {
    this.isConfigModalOpen = false;
    this.selectedRoomForEdit = null;
  }

  saveConfig() {
    if (!this.dormId || this.editPrice === null) return;

    this.isLoading = true;

    if (this.configType === 'furniture') {
      const selectedIds = this.selectedRoomForEdit ? [this.selectedRoomForEdit.id] : this.getSelectedRooms().map(r => r.id);
      this.dormitoryService.updateFurnitureFee(this.dormId, selectedIds, this.editPrice).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.status === 'success') {
            // Update local state
            this.updateLocalFurnitureFee(selectedIds, this.editPrice!);
            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: 'ปรับปรุงค่าเฟอร์นิเจอร์เรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
          }
          this.closeConfigModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Failed to update furniture fee', err);
          Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง' });
          this.cdr.detectChanges();
        }
      });
    } else {
      // Water or Electric
      const payload = {
        water_rate: this.configType === 'water' ? this.editPrice : this.currentWaterRate,
        electricity_rate: this.configType === 'electric' ? this.editPrice : this.currentElectricRate
      };

      this.dormitoryService.updateUtility(this.dormId, payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.status === 'success') {
            if (this.configType === 'water') this.currentWaterRate = this.editPrice!;
            else this.currentElectricRate = this.editPrice!;

            this.applyGlobalRatesToRooms();
            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: `ปรับปรุงค่า${this.configType === 'water' ? 'น้ำ' : 'ไฟฟ้า'}เรียบร้อยแล้ว`, timer: 1500, showConfirmButton: false });
          }
          this.closeConfigModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Failed to update utility', err);
          Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง' });
          this.cdr.detectChanges();
        }
      });
    }
  }

  updateLocalFurnitureFee(ids: number[], fee: number) {
    this.floors.forEach(f => {
      f.rooms.forEach(r => {
        if (ids.includes(r.id)) {
          r.furnitureFee = fee;
        }
      });
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
