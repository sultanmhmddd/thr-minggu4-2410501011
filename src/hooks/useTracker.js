import { useContext } from 'react';
import { AmalanContext } from '../context/AmalanContext';

export const useHabits = () => {
  const { state, dispatch, isDark, setIsDark } = useContext(AmalanContext);

  const hitungProgress = () => {
    if (state.daftar.length === 0) return 0;
    let totalPoin = 0;
    state.daftar.forEach(item => {
      if (item.tipe === 'cek') totalPoin += item.selesai ? 1 : 0;
      else totalPoin += (item.dikerjakan / item.target);
    });
    return Math.round((totalPoin / state.daftar.length) * 100);
  };

  return {
    list: state.daftar,
    progress: hitungProgress(),
    isDark,
    toggleCek: (id) => dispatch({ type: 'TOGGLE_CEK', id }),
    updateSkor: (id, index) => dispatch({ type: 'UPDATE_SKOR', id, index }),
    tambahItem: (item) => dispatch({ type: 'TAMBAH_BARU', payload: item }),
    hapusItem: (id) => dispatch({ type: 'HAPUS_ITEM', id }),
    reset: () => dispatch({ type: 'RESET' }),
    setDark: () => setIsDark(!isDark)
  };
};