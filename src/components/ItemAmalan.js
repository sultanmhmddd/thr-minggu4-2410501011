import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ItemAmalan({ item, isDark, onAction, onHapus }) {
  return (
    <View style={[styles.card, isDark ? styles.bgD : styles.bgL]}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerCard}>
          <Text style={[styles.nama, isDark && {color:'#fff'}]}>{item.tugas}</Text>
          <TouchableOpacity onPress={() => onHapus(item.id)}>
             <Text style={{color: '#EF4444', fontWeight: 'bold', fontSize: 18}}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.aksiRow}>
          {item.tipe === 'cek' ? (
            <TouchableOpacity onPress={() => onAction(item.id)} style={[styles.box, item.selesai && styles.boxDone]}>
              {item.selesai && <Text style={{color:'#fff'}}>✓</Text>}
            </TouchableOpacity>
          ) : (
            <View style={styles.skorRow}>
              {[...Array(item.target)].map((_, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => onAction(item.id, index)}
                  style={[styles.dot, index < item.dikerjakan && styles.dotDone]}
                />
              ))}
              <Text style={[styles.sub, isDark && {color:'#94A3B8'}]}>{item.dikerjakan}/{item.target}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 15, marginBottom: 10, elevation: 2 },
  bgL: { backgroundColor: '#fff' },
  bgD: { backgroundColor: '#1E293B' },
  headerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  nama: { fontWeight: 'bold', fontSize: 15 },
  aksiRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  box: { width: 32, height: 32, borderRadius: 10, borderWidth: 2, borderColor: '#059669', justifyContent: 'center', alignItems: 'center' },
  boxDone: { backgroundColor: '#059669' },
  skorRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  dot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#10B981', marginRight: 10, marginBottom: 5 },
  dotDone: { backgroundColor: '#10B981' },
  sub: { fontSize: 12, marginLeft: 5 }
});