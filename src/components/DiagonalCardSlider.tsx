import React, { useState, useRef, useCallback, useEffect } from 'react';
import './DiagonalCardSlider.css';

interface CardData {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const DiagonalCardSlider: React.FC = () => {
  const [offset, setOffset] = useState<number>(0);
  const [hoveredCard, setHoveredCard] = useState<CardData | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startOffset = useRef<number>(0);

  // Список изображений с описаниями IT-проектов
  const originalCards: CardData[] = [
    { 
      id: 1, 
      src: '/imgCard/4182c3a36ae0287e74f45e4bc4b0478087395003.png', 
      alt: 'Telegram Mini App',
      title: 'Telegram Mini App для администрирования каналов',
      description: 'Разработка полнофункционального Telegram mini app для управления и администрирования Telegram-каналов с интуитивным интерфейсом и расширенными возможностями модерации.'
    },
    { 
      id: 2, 
      src: '/imgCard/59ba5cf45380257ee8e166783aea5b97c3ea0cdc.png', 
      alt: 'HR-сервис',
      title: 'HR-сервис для подбора специалистов',
      description: 'Комплексная платформа для автоматизации процессов подбора персонала с AI-алгоритмами сопоставления кандидатов, системой интервью и аналитикой эффективности найма.'
    },
    { 
      id: 3, 
      src: '/imgCard/7a09640693403a43979b9a4739084f32d370db3c.png', 
      alt: 'E-commerce платформа',
      title: 'E-commerce платформа с микросервисной архитектурой',
      description: 'Масштабируемое решение для интернет-торговли с микросервисной архитектурой, интеграцией платежных систем и системой управления складскими запасами.'
    },
    { 
      id: 4, 
      src: '/imgCard/917b42be1295ce1f172cb33877e54f1dec65e57f.png', 
      alt: 'Мобильное приложение',
      title: 'Мобильное приложение для фитнес-трекинга',
      description: 'Кроссплатформенное мобильное приложение с интеграцией носимых устройств, персональными тренировками и социальными функциями для мотивации пользователей.'
    },
    { 
      id: 5, 
      src: '/imgCard/a45850229f15ef811703228f465820f420082051.png', 
      alt: 'CRM система',
      title: 'CRM система для управления клиентами',
      description: 'Современная CRM-система с автоматизацией продаж, аналитикой клиентского пути, интеграцией с внешними сервисами и мобильным приложением для менеджеров.'
    },
    { 
      id: 6, 
      src: '/imgCard/ba47b00bf8270ce37d877ac1a7145dc748420631.png', 
      alt: 'Блокчейн платформа',
      title: 'Блокчейн платформа для NFT маркетплейса',
      description: 'Децентрализованная платформа для создания, торговли и управления NFT с поддержкой множественных блокчейнов и интегрированным кошельком.'
    },
    { 
      id: 7, 
      src: '/imgCard/d2e3ad2a21dceaaeafc305c81f44cd9f06b16da3.png', 
      alt: 'IoT платформа',
      title: 'IoT платформа для умного дома',
      description: 'Комплексное решение для управления устройствами умного дома с машинным обучением, голосовым управлением и мобильным приложением для удаленного контроля.'
    }
  ];

  const cardSpacing = 200; // расстояние между карточками по диагонали
  const totalCards = originalCards.length;

  // Обработка мыши
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isExpanding || isFullscreen) return; // Блокируем перетаскивание во время анимации
    isDragging.current = true;
    startX.current = e.clientX;
    startOffset.current = offset;
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
  }, [offset, isExpanding, isFullscreen]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - startX.current;
    const newOffset = startOffset.current + deltaX;
    setOffset(newOffset);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
  }, []);

  // Обработка колесика мыши
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isExpanding || isFullscreen) return; // Блокируем прокрутку во время анимации
    e.preventDefault();
    const delta = e.deltaY > 0 ? -50 : 50;
    setOffset(prev => prev + delta);
  }, [isExpanding, isFullscreen]);

  // Обработка клика по карточке
  const handleCardClick = useCallback((card: CardData, position: number, e: React.MouseEvent) => {
    if (isDragging.current || isExpanding || isFullscreen) return;
    
    e.stopPropagation();
    setSelectedCard(card);
    setSelectedPosition(position);
    setIsExpanding(true);
    
    // Через 0.8 секунд начинаем переход к полноэкранному режиму
    setTimeout(() => {
      setIsFullscreen(true);
    }, 800);
  }, [isExpanding, isFullscreen]);

  // Функция для возврата к слайдеру
  const handleBackToSlider = useCallback(() => {
    setIsFullscreen(false);
    setIsExpanding(false);
    
    // Небольшая задержка перед сбросом выбранной карточки
    setTimeout(() => {
      setSelectedCard(null);
      setSelectedPosition(null);
    }, 500);
  }, []);

  // Добавляем глобальные обработчики мыши
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`diagonal-slider-container ${isExpanding ? 'expanding' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
      ref={sliderRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
    >
      {/* Область описания карточки */}
      <div className={`card-description ${hoveredCard ? 'visible' : ''}`}>
        {hoveredCard && (
          <>
            <div className="card-category">Fintech</div>
            <h3 className="card-title">{hoveredCard.title}</h3>
          </>
        )}
      </div>

      <div 
        className="diagonal-slider-scene"
      >
        {(() => {
          const visibleCards = [];

          // Центрируем диагональ на экране
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const diagonalStartX = centerX - 800;
          const diagonalStartY = centerY + 200;

          // Определяем диапазон карточек, которые нужно отрисовать
          const screenBuffer = 800; // буфер за пределами экрана
          const startScreenX = -screenBuffer;
          const endScreenX = window.innerWidth + screenBuffer;

          // Вычисляем какие позиции карточек попадают в видимую область
          const startPosition = Math.floor((startScreenX - diagonalStartX - offset) / cardSpacing) - 1;
          const endPosition = Math.ceil((endScreenX - diagonalStartX - offset) / cardSpacing) + 1;

          // Создаем массив позиций и сортируем для правильного наложения
          const positions = [];
          for (let position = startPosition; position <= endPosition; position++) {
            positions.push(position);
          }
          
          // Сортируем позиции: сначала ближние (меньший position), потом дальние
          // Это обеспечит правильный порядок в DOM для hover событий
          positions.sort((a, b) => a - b);
          
          // Рендерим карточки в правильном порядке
          for (const position of positions) {
            // Используем модульную арифметику для бесконечного повторения
            const cardIndex = ((position % totalCards) + totalCards) % totalCards;
            const card = originalCards[cardIndex];

            // Правильное диагональное позиционирование - все карточки на одной линии
            const diagonalOffset = position * cardSpacing + offset;
            
            // Диагональ под углом 45 градусов - одинаковое смещение по X и Y
            const diagonalX = diagonalStartX + diagonalOffset;
            const diagonalY = diagonalStartY - diagonalOffset * 0.5; // Уменьшаем коэффициент для более пологой диагонали
            
            // 3D глубина для наложения карточек
            const diagonalZ = -position * 5; // Каждая следующая карточка на 5px дальше
            
            // Убираем поворот - карточки должны лежать ровно
            const rotationY = 0;
            
            // Добавляем hover эффект к базовой трансформации
            // Проверяем и ID карточки, и позицию, чтобы выдвигалась только одна конкретная карточка
            const isHovered = hoveredCard?.id === card.id && hoveredPosition === position;
            const isSelected = selectedCard?.id === card.id && selectedPosition === position;
            const hoverOffsetX = isHovered ? 120 : 0;
            const hoverOffsetY = 0; // Убираем вертикальное движение
            const hoverOffsetZ = isHovered ? 50 : 0;
            
            const finalTransform = `translate3d(${diagonalX + hoverOffsetX}px, ${diagonalY + hoverOffsetY}px, ${diagonalZ + hoverOffsetZ}px) rotateY(${rotationY}deg)`;
            
            // Определяем видимость карточки во время анимации
            let cardOpacity = 1;
            if (isExpanding || isFullscreen) {
              cardOpacity = isSelected ? 0 : 0; // Скрываем все карточки во время анимации
            }
            
            visibleCards.push(
              <div
                key={`card-${position}`}
                className={`diagonal-card ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}
                style={{
                  transform: finalTransform,
                  opacity: cardOpacity,
                  zIndex: isHovered ? 9999 : 1000 + position
                }}
                onMouseEnter={() => {
                  if (!isExpanding && !isFullscreen) {
                    setHoveredCard(card);
                    setHoveredPosition(position);
                  }
                }}
                onMouseLeave={() => {
                  if (!isExpanding && !isFullscreen) {
                    setHoveredCard(null);
                    setHoveredPosition(null);
                  }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => handleCardClick(card, position, e)}
              >
                <img
                  src={card.src}
                  alt={card.alt}
                  draggable={false}
                />
                <div className="card-title-overlay">
                  <span className="card-title-text">{card.title}</span>
                </div>
                <div className="card-shadow" />
              </div>
            );
          }

          return visibleCards;
        })()}
      </div>
      
      {/* Футер */}
      <div className="slider-footer">
        <h2 className="footer-title">Кейсы</h2>
      </div>

      {/* Выбранная карточка для анимации */}
      {selectedCard && selectedPosition !== null && (
        <div className={`selected-card-overlay ${isExpanding ? 'expanding' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="selected-card-container">
            <div 
              className="selected-card"
              style={{
                backgroundImage: `url(${selectedCard.src})`,
              }}
            >
              {isFullscreen && (
                <div className="fullscreen-content">
                  <button className="back-button" onClick={handleBackToSlider}>
                    ← Назад к кейсам
                  </button>
                  <div className="fullscreen-info">
                    <div className="fullscreen-category">Fintech</div>
                    <h1 className="fullscreen-title">{selectedCard.title}</h1>
                    <p className="fullscreen-description">{selectedCard.description}</p>
                    <div className="fullscreen-details">
                      <div className="detail-section">
                        <h3>Технологии</h3>
                        <div className="tech-tags">
                          <span className="tech-tag">React</span>
                          <span className="tech-tag">TypeScript</span>
                          <span className="tech-tag">Node.js</span>
                          <span className="tech-tag">PostgreSQL</span>
                        </div>
                      </div>
                      <div className="detail-section">
                        <h3>Результат</h3>
                        <p>Увеличение конверсии на 45%, сокращение времени обработки заявок в 3 раза</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagonalCardSlider;