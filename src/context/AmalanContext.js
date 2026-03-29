import React, { createContext, useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AmalanContext = createContext();

const dataAwal = {
  daftar: [
    { id: '1', tugas: 'Puasa Syawal', tipe: 'cek', selesai: false },
    { id: '2', tugas: 'Sholat Sunnah', tipe: 'skor', target: 2, dikerjakan: 0 },
  ],
};

const amalanReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_CEK':
      return { ...state, daftar: state.daftar.map(i => i.id === action.id ? { ...i, selesai: !i.selesai } : i) };
    
    case 'UPDATE_SKOR':
      return { ...state, daftar: state.daftar.map(i => {
        if (i.id === action.id) {
          // Jika klik buletan yang sudah aktif, dia berkurang (Toggle-like behavior)
          const baru = i.dikerjakan === action.index + 1 ? action.index : action.index + 1;
          return { ...i, dikerjakan: baru };
        }
        return i;
      })};

    case 'TAMBAH_BARU':
      return { ...state, daftar: [...state.daftar, action.payload] };

    case 'HAPUS_ITEM':
      return { ...state, daftar: state.daftar.filter(i => i.id !== action.id) };

    case 'RESET':
      return { ...state, daftar: state.daftar.map(i => i.tipe === 'cek' ? { ...i, selesai: false } : { ...i, dikerjakan: 0 }) };

    case 'MUAT': return action.payload;
    default: return state;
  }
};

export const AmalanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(amalanReducer, dataAwal);
  const [isDark, setIsDark] = useState(false);

  // Logika Auto-Reset Harian & Load Data
  useEffect(() => {
    const muatData = async () => {
      const res = await AsyncStorage.getItem('@halal_v3');
      const tanggalTerakhir = await AsyncStorage.getItem('@last_date');
      const hariIni = new Date().toISOString().split('T')[0];

      if (res) {
        let dataParsed = JSON.parse(res);
        if (tanggalTerakhir !== hariIni) {
          dataParsed.daftar = dataParsed.daftar.map(i => 
            i.tipe === 'cek' ? { ...i, selesai: false } : { ...i, dikerjakan: 0 }
          );
          await AsyncStorage.setItem('@last_date', hariIni);
        }
        dispatch({ type: 'MUAT', payload: dataParsed });
      } else {
        await AsyncStorage.setItem('@last_date', hariIni);
      }
    };
    muatData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@halal_v3', JSON.stringify(state));
  }, [state]);

  return (
    <AmalanContext.Provider value={{ state, dispatch, isDark, setIsDark }}>
      {children}
    </AmalanContext.Provider>
  );
};