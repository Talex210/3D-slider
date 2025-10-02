import React, { useState, useRef, useCallback, useEffect } from 'react';
import './DiagonalCardSlider.css';

interface CardData {
  id: number;
  src: string;
  alt: string;
}

const DiagonalCardSlider: React.FC = () => {
  const [offset, setOffset] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startOffset = useRef<number>(0);

  // Список изображений (дублируем для бесконечности)
  const originalCards: CardData[] = [
    { id: 1, src: '/imgCard/4182c3a36ae0287e74f45e4bc4b0478087395003.png', alt: 'Card 1' },
    { id: 2, src: '/imgCard/59ba5cf45380257ee8e166783aea5b97c3ea0cdc.png', alt: 'Card 2' },
    { id: 3, src: '/imgCard/7a09640693403a43979b9a4739084f32d370db3c.png', alt: 'Card 3' },
    { id: 4, src: '/imgCard/917b42be1295ce1f172cb33877e54f1dec65e57f.png', alt: 'Card 4' },
    { id: 5, src: '/imgCard/a45850229f15ef811703228f465820f420082051.png', alt: 'Card 5' },
    { id: 6, src: '/imgCard/ba47b00bf8270ce37d877ac1a7145dc748420631.png', alt: 'Card 6' },
    { id: 7, src: '/imgCard/d2e3ad2a21dceaaeafc305c81f44cd9f06b16da3.png', alt: 'Card 7' }
  ];

  const cardSpacing = 200; // расстояние между карточками по диагонали
  const totalCards = originalCards.length;

  // Обработка мыши
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startOffset.current = offset;
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
  }, [offset]);

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
    e.preventDefault();
    const delta = e.deltaY > 0 ? -50 : 50;
    setOffset(prev => prev + delta);
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
      className="diagonal-slider-container"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      <div className="diagonal-slider-scene">
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

          // Рендерим только нужные карточки
          for (let position = startPosition; position <= endPosition; position++) {
            // Используем модульную арифметику для бесконечного повторения
            const cardIndex = ((position % totalCards) + totalCards) % totalCards;
            const card = originalCards[cardIndex];

            // Позиция карточки с реальной 3D глубиной для эффекта книжной полки
            const baseX = position * cardSpacing + offset;
            const baseY = -(position * cardSpacing * 0.6) - (offset * 0.6);
            
            // Используем реальную 3D глубину для эффекта книжной полки
            // Карточки слева (меньшая позиция) находятся ближе к зрителю
            // Каждая следующая карточка "лежит поверх" предыдущей
            const baseZ = -position * 5; // Каждая предыдущая позиция на 5px ближе
            
            const diagonalX = baseX + diagonalStartX;
            const diagonalY = baseY + diagonalStartY;
            const diagonalZ = baseZ;

            // Добавляем небольшой поворот для усиления 3D эффекта книжной полки
            const rotationY = -position * 0.5; // Поворот в обратную сторону для естественного эффекта
            
            visibleCards.push(
              <div
                key={`card-${position}`}
                className="diagonal-card"
                style={{
                  transform: `translate3d(${diagonalX}px, ${diagonalY}px, ${diagonalZ}px) rotateY(${rotationY}deg)`,
                  opacity: 1
                }}
              >
                <img
                  src={card.src}
                  alt={card.alt}
                  draggable={false}
                />
                <div className="card-shadow" />
              </div>
            );
          }

          return visibleCards;
        })()}
      </div>
    </div>
  );
};

export default DiagonalCardSlider;