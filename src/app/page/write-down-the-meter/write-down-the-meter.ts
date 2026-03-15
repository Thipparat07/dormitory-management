import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Dormitory } from '../../services/api/dormitory/dormitory';
import { forkJoin, map, Subject, switchMap, takeUntil, tap, catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HeaderOwner } from '../Dashboards/header-owner/header-owner';

interface RoomMeter {
  id: number;
  number: string;
  occupied: boolean;
  prevMeter: number;
  currentMeter: number | null;
  hasChanged: boolean;
  prevHasChanged: boolean;
  isNew: boolean;
}

interface FloorMeters {
  number: number;
  rooms: RoomMeter[];
}

@Component({
  selector: 'app-write-down-the-meter',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderOwner],
  templateUrl: './write-down-the-meter.html',
  styleUrl: './write-down-the-meter.scss',
})
export class WriteDownTheMeter implements OnInit, OnDestroy {
  private dormitoryService = inject(Dormitory);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  dormId: string | null = null;
  isLoading: boolean = true;

  selectedTab: 'water' | 'electric' = 'water';
  currentMonth: string = '';
  prevMonth: string = '';
  selectedMonth: string = ''; // YYYY-MM

  minMonth: string = ''; // Removed restriction
  maxMonth: string = '';

  thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  waterData: FloorMeters[] = [];
  electricData: FloorMeters[] = [];
  isFirstTimeSetup: boolean = false;

  private refresh$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor() {
    const now = new Date();
    this.selectedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    this.maxMonth = this.selectedMonth; 
    
    // Restrict to current and 1 month prior
    const prevArr = this.getPreviousMonthArr(this.selectedMonth);
    this.minMonth = `${prevArr[0]}-${String(prevArr[1]).padStart(2, '0')}`;
  }

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      this.dormId = params['dormId'] || null;
      if (this.dormId) {
        this.initDataStream();
        this.onMonthChange();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initDataStream() {
    this.refresh$.pipe(
      tap(() => {
        this.isLoading = true;
        this.cdr.detectChanges();
      }),
      switchMap(() => {
        if (!this.dormId) return of(null);
        
        const prevArr = this.getPreviousMonthArr(this.selectedMonth);
        const prevMonth_YYYYMM = `${prevArr[0]}-${String(prevArr[1]).padStart(2, '0')}`;

        return forkJoin({
          rooms: this.dormitoryService.getRooms(Number(this.dormId)),
          readings: this.dormitoryService.getMeterReadings(this.dormId, this.selectedMonth),
          prevReadings: this.dormitoryService.getMeterReadings(this.dormId, prevMonth_YYYYMM)
        }).pipe(
          catchError(err => {
            console.error('Failed to fetch data', err);
            return of(null);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      if (res && res.rooms.status === 'success' && res.readings.status === 'success' && res.prevReadings.status === 'success') {
        this.processData(res.rooms.data, res.readings.data, res.prevReadings.data);
      }
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  private getPreviousMonthArr(monthYear: string): [number, number] {
    let [year, month] = monthYear.split('-');
    let m = parseInt(month, 10);
    let y = parseInt(year, 10);
    m -= 1;
    if (m === 0) {
      m = 12;
      y -= 1;
    }
    return [y, m];
  }

  getFormattedMonth(dateStr: string = this.selectedMonth): string {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    return `${this.thaiMonths[monthIndex]}/${year}`;
  }

  onMonthChange() {
    this.currentMonth = this.getFormattedMonth();

    if (this.selectedMonth) {
      const prevArr = this.getPreviousMonthArr(this.selectedMonth);
      this.prevMonth = `${this.thaiMonths[prevArr[1] - 1]}/${prevArr[0]}`;
    }

    this.refresh$.next();
  }

  fetchData() {
    this.refresh$.next();
  }

  processData(rooms: any[], readings: any[], prevReadings: any[]) {
    const readingMap = new Map<number, any>();
    readings.forEach(r => readingMap.set(r.room_id, r));

    const prevReadingMap = new Map<number, any>();
    prevReadings.forEach(r => prevReadingMap.set(r.room_id, r));

    const waterFloorMap = new Map<number, RoomMeter[]>();
    const electricFloorMap = new Map<number, RoomMeter[]>();
    let hasNewEntry = false;

    rooms.forEach(r => {
      const reading = readingMap.get(r.id);
      const prevReading = prevReadingMap.get(r.id);
      const floorNum = r.floor_number;

      const isNew = !reading && !prevReading;
      if (isNew) hasNewEntry = true;

      let initialWaterPrev = 0;
      let initialElecPrev = 0;

      if (prevReading) {
        initialWaterPrev = Number(prevReading.water_current);
        initialElecPrev = Number(prevReading.electricity_current);
      } else if (reading) {
        initialWaterPrev = Number(reading.water_previous);
        initialElecPrev = Number(reading.electricity_previous);
      }

      // Water Data
      const waterRoom: RoomMeter = {
        id: r.id,
        number: r.room_number,
        occupied: r.join_status === 'approved',
        prevMeter: initialWaterPrev,
        currentMeter: reading ? Number(reading.water_current) : initialWaterPrev,
        hasChanged: false,
        prevHasChanged: false,
        isNew: isNew
      };
      if (!waterFloorMap.has(floorNum)) waterFloorMap.set(floorNum, []);
      waterFloorMap.get(floorNum)!.push(waterRoom);

      // Electric Data
      const electricRoom: RoomMeter = {
        id: r.id,
        number: r.room_number,
        occupied: r.join_status === 'approved',
        prevMeter: initialElecPrev,
        currentMeter: reading ? Number(reading.electricity_current) : initialElecPrev,
        hasChanged: false,
        prevHasChanged: false,
        isNew: isNew
      };
      if (!electricFloorMap.has(floorNum)) electricFloorMap.set(floorNum, []);
      electricFloorMap.get(floorNum)!.push(electricRoom);
    });

    this.isFirstTimeSetup = hasNewEntry;
    const sortedFloors = Array.from(waterFloorMap.keys()).sort((a, b) => a - b);

    this.waterData = sortedFloors.map(fNum => ({
      number: fNum,
      rooms: waterFloorMap.get(fNum)!
    }));

    this.electricData = sortedFloors.map(fNum => ({
      number: fNum,
      rooms: electricFloorMap.get(fNum)!
    }));
  }

  get currentData(): FloorMeters[] {
    return this.selectedTab === 'water' ? this.waterData : this.electricData;
  }

  selectTab(tab: 'water' | 'electric') {
    this.selectedTab = tab;
  }

  onReadingChange(room: RoomMeter) {
    room.hasChanged = true;
  }

  onPrevReadingChange(room: RoomMeter) {
    if (room.isNew) {
      room.prevHasChanged = true;
      room.hasChanged = true;
      if (room.currentMeter === null || room.currentMeter === room.prevMeter) {
        room.currentMeter = room.prevMeter;
      }
    }
  }

  onEnterKey(room: RoomMeter, tab: 'water' | 'electric', column: 'prev' | 'current') {
    const data = tab === 'water' ? this.waterData : this.electricData;
    const flatRooms = data.flatMap(f => f.rooms);
    const currentIndex = flatRooms.findIndex(r => r.id === room.id);

    if (currentIndex !== -1 && currentIndex < flatRooms.length - 1) {
      const nextRoom = flatRooms[currentIndex + 1];
      const nextInputId = `input-${tab}-${column}-${nextRoom.id}`;
      const element = document.getElementById(nextInputId);
      if (element) {
        element.focus();
        (element as HTMLInputElement).select();
      }
    }
  }

  anyChanges(): boolean {
    return this.waterData.some(f => f.rooms.some(r => r.hasChanged)) ||
      this.electricData.some(f => f.rooms.some(r => r.hasChanged));
  }

  getProgressInfo() {
    const allRooms = this.currentData.flatMap(f => f.rooms);
    const total = allRooms.length;
    const recorded = allRooms.filter(r => r.hasChanged || (r.currentMeter !== r.prevMeter)).length;
    return { total, recorded, percent: total > 0 ? (recorded / total) * 100 : 0 };
  }

  getUnitsUsed(room: RoomMeter): number {
    if (room.currentMeter === null) {
      return 0;
    }
    if (room.prevMeter === 0) {
      return 0;
    }
    const units = room.currentMeter - room.prevMeter;
    return Math.max(0, units);
  }

  async saveAll() {
    if (!this.dormId) return;

    const allRoomsWater = this.waterData.flatMap(f => f.rooms);
    const allRoomsElec = this.electricData.flatMap(f => f.rooms);

    const roomIds = Array.from(new Set([
      ...allRoomsWater.filter(r => r.hasChanged).map(r => r.id),
      ...allRoomsElec.filter(r => r.hasChanged).map(r => r.id)
    ]));

    if (roomIds.length === 0) return;

    const uninitialized = [...allRoomsWater, ...allRoomsElec].filter(r => r.isNew && !r.prevHasChanged && r.prevMeter === 0);
    if (uninitialized.length > 0) {
      const confirm = await Swal.fire({
        title: 'ตรวจพบข้อมูลไม่ครบถ้วน',
        text: `มีห้องที่ยังไม่ได้ระบุ "เลขเดือนก่อนหน้า" เพื่อตั้งต้นระบบ คุณต้องการข้ามและบันทึกเฉพาะห้องที่มีข้อมูลหรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'บันทึกเฉพาะที่มีข้อมูล',
        cancelButtonText: 'กลับไปตรวจสอบ',
        reverseButtons: true
      });
      if (!confirm.isConfirmed) return;
    }

    for (const rId of roomIds) {
      const wRoom = allRoomsWater.find(r => r.id === rId);
      const eRoom = allRoomsElec.find(r => r.id === rId);
      const wCondition = wRoom && wRoom.currentMeter! < wRoom.prevMeter;
      const eCondition = eRoom && eRoom.currentMeter! < eRoom.prevMeter;

      if (wCondition || eCondition) {
        Swal.fire({
          icon: 'error',
          title: 'ข้อมูลไม่ถูกต้อง',
          text: `ห้อง ${(wRoom || eRoom)!.number}: เลขมิเตอร์ปัจจุบันต้องมากกว่าหรือเท่ากับเลขก่อนหน้า`
        });
        return;
      }
    }

    this.isLoading = true;
    const requests = roomIds.map(rId => {
      const wRoom = allRoomsWater.find(r => r.id === rId);
      const eRoom = allRoomsElec.find(r => r.id === rId);

      const payload: any = {
        room_id: rId,
        month_year: this.selectedMonth,
        water_current: wRoom?.currentMeter ?? 0,
        electricity_current: eRoom?.currentMeter ?? 0
      };
      if (wRoom?.isNew && wRoom.prevHasChanged) payload.water_previous = wRoom.prevMeter;
      if (eRoom?.isNew && eRoom.prevHasChanged) payload.electricity_previous = eRoom.prevMeter;

      return this.dormitoryService.recordMeterReading(this.dormId!, payload);
    });

    forkJoin(requests).subscribe({
      next: (results) => {
        this.isLoading = false;
        if (results.every(res => res.status === 'success')) {
          Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 1500, showConfirmButton: false });
          this.fetchData();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Save error', err);
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.error?.message || 'ไม่สามารถบันทึกข้อมูลได้' });
        this.cdr.detectChanges();
      }
    });
  }
}
