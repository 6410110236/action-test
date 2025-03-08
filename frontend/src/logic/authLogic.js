import ax from '../api/ax';
import conf from '../api/main';

export const loginAPI = async (username, password) => {
  try {
    const response = await ax.post(conf.loginEndpoint, { identifier: username, password });
    if (response.data?.jwt && response.data?.user?.id > 0) {
      return response.data; // คืนค่า { jwt, user, ... }
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Login service not found. Please check API configuration');
    } else if (error.response?.status === 400) {
      throw new Error('Invalid username or password');
    } else {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
};

export const registerAPI = async (username, email, password) => {
  try {
    // สมมุติว่า endpoint สำหรับสมัครสมาชิกคือ /api/auth/local/register
    const response = await ax.post('/api/auth/local/register', { username, email, password });
    if (response.data?.jwt && response.data?.user?.id > 0) {
      return response.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Registration error: ' + error.response.data.message);
    } else {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้เพิ่มเติม (เช่น role, email ฯลฯ)
export const fetchUserData = async (jwt) => {
  try {
    const response = await ax.get(conf.jwtUserEndpoint, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (response.data && response.data.id) {
      return response.data;
    } else {
      throw new Error('Invalid user data format');
    }
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};

// ฟังก์ชัน updateJwt ใช้เก็บ JWT ใน localStorage เฉพาะเมื่อ rememberMe เป็น true
export const updateJwt = (jwt, role, rememberMe) => {
  if (jwt && rememberMe) {
    localStorage.setItem(conf.jwtSessionStorageKey, jwt);
    localStorage.setItem(conf.roleSessionStorageKey, role);
  } else {
    localStorage.removeItem(conf.jwtSessionStorageKey);
    localStorage.removeItem(conf.roleSessionStorageKey);
  }
};
