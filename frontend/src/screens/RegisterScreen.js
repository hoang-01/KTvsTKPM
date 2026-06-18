import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock, Phone, ArrowLeft } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { authService } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { fullName, email, phone, password } = formData;
    
    // Check trống
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    // Check định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Lỗi nhập liệu', 'Địa chỉ email không đúng định dạng.');
      return;
    }

    // Check số điện thoại
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone.trim())) {
      Alert.alert('Lỗi nhập liệu', 'Số điện thoại phải chứa từ 9 đến 11 chữ số.');
      return;
    }

    // Check độ dài mật khẩu
    if (password.length < 6) {
      Alert.alert('Lỗi nhập liệu', 'Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
      Alert.alert('Đăng ký thành công', 'Tài khoản của bạn đã được khởi tạo. Vui lòng đăng nhập để tiếp tục.', [
        { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi đăng ký', typeof error === 'string' ? error : (error.message || 'Đăng ký không thành công. Vui lòng thử lại.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#f8fafc', '#f1f5f9']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>Bắt đầu trải nghiệm BookingPro</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User color={theme.colors.textSecondary} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={formData.fullName}
                onChangeText={(text) => setFormData({...formData, fullName: text})}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail color={theme.colors.textSecondary} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone color={theme.colors.textSecondary} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock color={theme.colors.textSecondary} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
              <LinearGradient
                colors={theme.colors.gradients.primary}
                style={styles.gradient}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Đăng ký ngay</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { margin: 20, padding: 8, borderRadius: 12, backgroundColor: 'white', width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginBottom: 40 },
  form: { width: '100%' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
  registerButton: { marginTop: 24, borderRadius: 16, ...theme.shadows.md },
  gradient: { height: 56, justifyContent: 'center', alignItems: 'center', borderRadius: 16 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
