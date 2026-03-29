import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image, Alert } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/Theme';
import Header from '../components/Header';
import Card from '../components/Card';
import AppService from '../services/AppService';

const AppSelector = ({ onBack }) => {
  const [apps, setApps] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('1234');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allApps, savedApps, savedPin] = await Promise.all([
          AppService.getInstalledApps(),
          AppService.getSelectedApps(),
          AppService.getMasterPin(),
        ]);
        setApps(allApps);
        setSelectedApps(savedApps.map(a => a.id));
        setPin(savedPin);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleApp = (appId) => {
    setSelectedApps(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const handleSave = async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN must be 4 digits.');
      return;
    }
    const selected = apps.filter(app => selectedApps.includes(app.id));
    await AppService.saveSelectedApps(selected);
    await AppService.setMasterPin(pin);
    await AppService.syncMonitoring();
    Alert.alert('Success', 'App protection settings updated.');
    onBack();
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item, index }) => {
    const isSelected = selectedApps.includes(item.id);
    return (
      <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
        <TouchableOpacity onPress={() => toggleApp(item.id)} activeOpacity={0.7}>
          <Card style={[styles.appItem, isSelected && styles.selectedItem]}>
            <View style={styles.appIconBox}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.appName}>{item.name}</Text>
                <Text style={styles.appPackage}>{item.package}</Text>
            </View>
            <View style={[styles.checkbox, isSelected && styles.checked]}>
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="App Protection" 
        leftIcon={<Text style={{ fontSize: 20 }}>←</Text>} 
        onLeftPress={onBack} 
      />
      
      <View style={styles.pinSection}>
        <Text style={styles.pinLabel}>Protection PIN:</Text>
        <TextInput 
          style={styles.pinInput}
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          placeholder="Set 4-digit PIN"
        />
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Search apps..." 
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={COLORS.light.textSecondary}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingTxt}>Fetching installed apps...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredApps}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyTxt}>No apps found.</Text>
          }
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnTxt}>Save Protection Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 16,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  pinSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    margin: SPACING.md,
    marginBottom: 0,
    padding: SPACING.md,
    borderRadius: 16,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pinLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pinInput: {
    width: 100,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.light.text,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: 12,
  },
  selectedItem: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: '#EEF2FF',
  },
  appIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appName: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
  },
  appPackage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTxt: {
    marginTop: 12,
    color: COLORS.light.textSecondary,
  },
  emptyTxt: {
    textAlign: 'center',
    marginTop: 40,
    color: COLORS.light.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  saveBtnTxt: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  }
});

export default AppSelector;
