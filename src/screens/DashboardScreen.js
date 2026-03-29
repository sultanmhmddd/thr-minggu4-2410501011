import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  Modal, 
  Platform, 
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';
import { useHabits } from '../hooks/useTracker';
import ItemAmalan from '../components/ItemAmalan';

export default function DashboardScreen() {
  const { list, progress, isDark, toggleCek, updateSkor, tambahItem, hapusItem, reset, setDark } = useHabits();
  
  // State untuk Modal Tambah Kegiatan
  const [modalVisible, setModalVisible] = useState(false);
  const [namaBaru, setNamaBaru] = useState("");
  const [tipeBaru, setTipeBaru] = useState("cek");
  const [targetSkor, setTargetSkor] = useState("1");

  const handleSimpan = () => {
    if (namaBaru.trim() === "") return;

    const amalanBaru = {
      id: Date.now().toString(),
      tugas: namaBaru,
      tipe: tipeBaru,
      ...(tipeBaru === 'skor' ? { target: parseInt(targetSkor) || 1, dikerjakan: 0 } : { selesai: false })
    };

    tambahItem(amalanBaru);
    setNamaBaru("");
    setTargetSkor("1");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.layar, isDark ? {backgroundColor:'#0F172A'} : {backgroundColor:'#F8FAFC'}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.wadah}>
        {/* HEADER - Jarak aman dari Notch */}
        <View style={styles.header}>
          <Text style={[styles.brand, isDark && {color:'#6EE7B7'}]}>HalalTracker</Text>
          <TouchableOpacity onPress={setDark} style={styles.btnTema}>
            <Text style={{fontSize: 20}}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.kartuStats, isDark && {backgroundColor: '#1E293B'}]}>
          <View style={styles.rowStats}>
            <Text style={[styles.txtStats, isDark && {color: '#fff'}]}>Progres Ibadah Hari Ini</Text>
            <Text style={styles.angkaPersen}>{progress}%</Text>
          </View>
          <View style={styles.barKosong}>
            <View style={[styles.barIsi, {width: `${progress}%`}]} />
          </View>
          <Text style={styles.quote}>"Istiqomah adalah kunci keberkahan."</Text>
        </View>

        <FlatList 
          data={list}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <ItemAmalan 
              item={item} 
              isDark={isDark} 
              onAction={item.tipe === 'cek' ? toggleCek : updateSkor} 
              onHapus={hapusItem}
            />
          )}
          ListEmptyComponent={
            <Text style={{textAlign:'center', color:'gray', marginTop: 20}}>Belum ada kegiatan. Tambahkan di bawah!</Text>
          }
          contentContainerStyle={{paddingBottom: 20}}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnTambah} onPress={() => setModalVisible(true)}>
            <Text style={styles.txtPutih}>+ Tambah Kegiatan Baru</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={reset} style={styles.btnReset}>
            <Text style={{color:'#EF4444', fontWeight:'600'}}>Reset Harian</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.overlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalJudul}>Buat Target Ibadah</Text>
            
            <TextInput 
              placeholder="Nama Ibadah (misal: Sholat Dhuha)" 
              style={styles.input} 
              value={namaBaru}
              onChangeText={setNamaBaru}
            />

            <Text style={styles.label}>Pilih Tipe Kontrol:</Text>
            <View style={styles.tipeRow}>
              <TouchableOpacity 
                onPress={() => setTipeBaru('cek')} 
                style={[styles.btnTipe, tipeBaru === 'cek' && styles.btnTipeAktif]}
              >
                <Text style={tipeBaru === 'cek' && {color:'#059669', fontWeight:'bold'}}>Checklist</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setTipeBaru('skor')} 
                style={[styles.btnTipe, tipeBaru === 'skor' && styles.btnTipeAktif]}
              >
                <Text style={tipeBaru === 'skor' && {color:'#059669', fontWeight:'bold'}}>Target Skor</Text>
              </TouchableOpacity>
            </View>

            {tipeBaru === 'skor' && (
              <View>
                <Text style={styles.label}>Target Jumlah (1-10):</Text>
                <TextInput 
                  placeholder="Contoh: 2" 
                  keyboardType="numeric" 
                  style={styles.input} 
                  value={targetSkor}
                  onChangeText={setTargetSkor}
                />
              </View>
            )}

            <TouchableOpacity style={styles.btnSimpan} onPress={handleSimpan}>
              <Text style={styles.txtPutih}>Simpan ke Daftar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 15}}>
              <Text style={{color:'gray', textAlign:'center'}}>Batal</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1 },
  wadah: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 50 : 10 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  brand: { fontSize: 26, fontWeight: '900', color: '#059669', letterSpacing: 1 },
  btnTema: { padding: 8, backgroundColor: '#E2E8F0', borderRadius: 50 },
  kartuStats: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 20, 
    elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  rowStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txtStats: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  angkaPersen: { fontSize: 24, fontWeight: '800', color: '#059669' },
  barKosong: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, marginTop: 15, overflow: 'hidden' },
  barIsi: { height: '100%', backgroundColor: '#10B981' },
  quote: { fontSize: 11, fontStyle: 'italic', color: '#94A3B8', marginTop: 10, textAlign: 'center' },
  footer: { paddingVertical: 10 },
  btnTambah: { backgroundColor: '#059669', padding: 18, borderRadius: 15, alignItems: 'center', elevation: 3 },
  txtPutih: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnReset: { marginTop: 15, alignItems: 'center', paddingBottom: 10 },
  // Modal Styles
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 25 },
  modalBox: { backgroundColor: '#fff', borderRadius: 25, padding: 25 },
  modalJudul: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 15 },
  label: { fontSize: 13, color: '#64748B', marginBottom: 8, fontWeight: '600' },
  tipeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  btnTipe: { flex: 0.48, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center' },
  btnTipeAktif: { backgroundColor: '#D1FAE5', borderColor: '#059669' },
  btnSimpan: { backgroundColor: '#059669', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 }
});