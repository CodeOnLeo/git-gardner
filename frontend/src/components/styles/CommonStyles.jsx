import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


export const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 20px;
  position: relative;
  
  @media (prefers-color-scheme: dark) {
    background: #0f172a;
  }
  
`;

export const Form = styled.form`
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --secondary-color: #059669;
  --background: rgba(255, 255, 255, 0.95);
  --surface: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --success-color: #10b981;
  --error-color: #dc2626;
  --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-heavy: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  
  @media (prefers-color-scheme: dark) {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --secondary-color: #10b981;
    --background: rgba(15, 23, 42, 0.95);
    --surface: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --border-color: #334155;
    --success-color: #22c55e;
    --error-color: #ef4444;
    --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
    --shadow-heavy: 0 10px 15px rgba(0, 0, 0, 0.5), 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  padding: 48px;
  background: var(--background);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  border-radius: 24px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-heavy);
  animation: ${fadeIn} 0.6s ease-out;
  min-width: 500px;
  max-width: 600px;
  width: 100%;
  
  @media (max-width: 1024px) {
    padding: 40px;
    gap: 28px;
    min-width: 450px;
    max-width: 550px;
  }
  
  @media (max-width: 768px) {
    padding: 32px 24px;
    gap: 24px;
    min-width: 350px;
    max-width: 450px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 24px 20px;
    gap: 20px;
    min-width: 280px;
    max-width: 340px;
    border-radius: 16px;
  }
`;

export const Title = styled.h1`
  color: var(--text-primary);
  font-weight: 800;
  font-size: 38px;
  margin: 0 0 12px 0;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;

  span {
    display: block;
    color: var(--text-secondary);
    font-weight: 500;
    font-size: 18px;
    margin-top: 12px;
    -webkit-text-fill-color: var(--text-secondary);
  }

  @media (max-width: 1024px) {
    font-size: 34px;
    
    span {
      font-size: 17px;
    }
  }

  @media (max-width: 768px) {
    font-size: 30px;
    margin: 0 0 10px 0;
    
    span {
      font-size: 16px;
      margin-top: 10px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 26px;
    
    span {
      font-size: 15px;
      margin-top: 8px;
    }
  }
`;

export const Separator = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  div {
    width: 100px;
    height: 3px;
    border-radius: 5px;
    background-color: var(--font-color-sub);
  }

  span {
    color: var(--font-color);
    font-family: var(--font-SpaceMono);
    font-weight: 600;
  }
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 380px;
  height: 56px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  color: white;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-medium);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-heavy);
    background: linear-gradient(135deg, var(--primary-hover), var(--primary-color));
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 1024px) {
    max-width: 350px;
    height: 54px;
    font-size: 16px;
    gap: 12px;
  }

  @media (max-width: 768px) {
    max-width: 320px;
    height: 50px;
    font-size: 15px;
    gap: 11px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    max-width: 280px;
    height: 46px;
    font-size: 14px;
    gap: 10px;
    border-radius: 10px;
  }
`;

export const Input = styled.input`
  width: 100%;
  max-width: 380px;
  height: 56px;
  border-radius: 14px;
  border: 2px solid var(--border-color);
  background-color: var(--surface);
  font-size: 17px;
  font-weight: 500;
  color: var(--text-primary);
  padding: 0 18px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-light);

  &::placeholder {
    color: var(--text-secondary);
  }

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    background-color: var(--surface);
  }

  &:hover {
    border-color: var(--primary-color);
  }

  @media (max-width: 1024px) {
    max-width: 350px;
    height: 54px;
    font-size: 16px;
    padding: 0 16px;
  }

  @media (max-width: 768px) {
    max-width: 320px;
    height: 50px;
    font-size: 15px;
    padding: 0 15px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    max-width: 280px;
    height: 46px;
    font-size: 14px;
    padding: 0 14px;
    border-radius: 10px;
  }
`;

export const Icon = styled.svg`
  width: 20px;
  height: 20px;
  fill: currentColor;
`;

export const LogoutInfo = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.5;
  margin-top: 16px;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--primary-hover);
      text-decoration: underline;
    }
  }
`;

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  padding: 12px 16px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error-color);
  border-radius: 8px;
  color: var(--error-color);
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
`;

export const SuccessMessage = styled.div`
  padding: 12px 16px;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--success-color);
  border-radius: 8px;
  color: var(--success-color);
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
`;

export const Card = styled.div`
  --surface: #ffffff;
  --border-color: #e5e7eb;
  --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-heavy: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  
  @media (prefers-color-scheme: dark) {
    --surface: #1e293b;
    --border-color: #334155;
    --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
    --shadow-heavy: 0 10px 15px rgba(0, 0, 0, 0.5), 0 4px 6px rgba(0, 0, 0, 0.3);
  }
  
  background: var(--surface);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-medium);
  border: 1px solid var(--border-color);
  margin-bottom: 32px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: var(--shadow-heavy);
  }
  
  @media (max-width: 1024px) {
    padding: 28px;
    margin-bottom: 28px;
    border-radius: 14px;
  }
  
  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
  }
`;

export const CardTitle = styled.h2`
  --text-primary: #111827;
  
  @media (prefers-color-scheme: dark) {
    --text-primary: #f1f5f9;
  }
  
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-align: center;
  
  @media (max-width: 1024px) {
    font-size: 22px;
    margin: 0 0 18px 0;
  }
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin: 0 0 16px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    margin: 0 0 14px 0;
  }
`;

export const HeatmapContainer = styled.div`
  --surface: #ffffff;
  --border-color: #e5e7eb;
  --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  
  @media (prefers-color-scheme: dark) {
    --surface: #1e293b;
    --border-color: #334155;
    --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  background: var(--surface);
  border-radius: 16px;
  padding: 24px;
  margin-top: 28px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
  overflow-x: auto;
  
  @media (max-width: 1024px) {
    padding: 22px;
    margin-top: 26px;
    border-radius: 14px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 24px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    margin-top: 20px;
    border-radius: 10px;
  }
`;