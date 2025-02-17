import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Создаем корневой элемент
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Функция для скрытия прелоадера
const hidePreloader = () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Добавляем анимацию исчезновения
    preloader.style.opacity = '0';
    // Удаляем элемент после завершения анимации
    setTimeout(() => {
      preloader.remove();
    }, 500);
  }
};

// Рендерим приложение
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Скрываем прелоадер после полной загрузки
window.addEventListener('load', hidePreloader);
// На случай если событие load уже произошло
if (document.readyState === 'complete') {
  hidePreloader();
}