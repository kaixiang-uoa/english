export function checkPasswordStrength(password: string): {
  isStrong: boolean;
  message: string;
} {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { isStrong: false, message: '密码长度至少8位' };
  }
  
  const conditions = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar];
  const metConditions = conditions.filter(Boolean).length;
  
  if (metConditions < 3) {
    return { 
      isStrong: false, 
      message: '密码需包含大写字母、小写字母、数字、特殊字符中的至少三种' 
    };
  }

  return { isStrong: true, message: '密码强度符合要求' };
}