# Реализация индикатора аудио на карточках историй

## ⚠️ Важно: PostgreSQL и регистр символов
**PostgreSQL автоматически приводит все имена колонок к нижнему регистру**, если они не заключены в двойные кавычки. Поэтому:
- В базе данных: `hasaudio` (lowercase)
- В TypeScript коде: `hasAudio` (camelCase)
- В запросах к Supabase: используем `hasaudio` (lowercase)

## Обзор
Добавлена функциональность отображения индикатора на карточках историй, показывающего наличие аудио версии сказки для текущего языка.

## Изменения в базе данных

### 1. Добавление колонки `hasaudio`
```sql
-- Добавление колонки hasaudio в таблицу story_translation
-- ВАЖНО: PostgreSQL автоматически приводит имена к lowercase
ALTER TABLE story_translation 
ADD COLUMN hasaudio BOOLEAN DEFAULT false NOT NULL;

-- Создание индексов для оптимизации
CREATE INDEX idx_story_translation_hasaudio ON story_translation(hasaudio);
CREATE INDEX idx_story_translation_language_hasaudio ON story_translation(language, hasaudio);
```

### 2. Обновление существующих данных
```sql
-- Установка значений hasaudio на основе существующих аудио файлов
UPDATE story_translation st
SET hasaudio = true
WHERE EXISTS (
    SELECT 1 FROM story_audio sa
    WHERE sa.story_id = st.story_id 
    AND sa.language = st.language
);
```

### 3. Автоматизация через триггер
```sql
-- Триггер автоматически обновляет hasaudio при изменениях в story_audio
CREATE TRIGGER trigger_update_hasaudio
AFTER INSERT OR UPDATE OR DELETE ON story_audio
FOR EACH ROW
EXECUTE FUNCTION update_story_translation_hasaudio();
```

## Изменения в коде

### 1. Типы TypeScript (`src/types/index.ts`)
```typescript
export interface Story {
  // ... существующие поля
  hasAudio?: boolean; // Новое поле - указывает наличие аудио
}
```

### 2. API запросы (`src/services/supabase.ts`)
Обновлены все методы API для получения `hasAudio` из `story_translation`:
- `getAllByLanguage()` - список всех историй
- `getBySlug()` - получение одной истории
- `getById()` - получение по ID
- `getByTagSlug()` - истории по категории
- `search()` - поиск историй

Пример изменения:
```typescript
story_translation!inner (
  id,
  language,
  title,
  description,
  content,
  reading_time,
  hasaudio  // ← Добавлено (lowercase - важно для PostgreSQL!)
)

// В коде маппится как:
hasAudio: storyTranslation?.hasaudio || false  // camelCase в приложении
```

### 3. Компонент карточки истории (`src/components/StoryCard.tsx`)
Добавлен визуальный индикатор аудио:
```tsx
{/* Audio Available Badge */}
{story.hasAudio && (
  <View style={styles.audioBadge}>
    <Ionicons name="headset" size={16} color="#FFFFFF" />
  </View>
)}
```

**Стили индикатора:**
- Позиция: правый нижний угол изображения
- Цвет фона: `#10B981` (зеленый)
- Иконка: наушники (`headset`)
- Круглая форма с тенью для лучшей видимости

### 4. Хук фильтрации (`src/hooks/useStories.ts`)
Обновлен фильтр аудио для использования нового поля:
```typescript
if (filters.hasAudio) {
  filteredStories = filteredStories.filter(story => story.hasAudio);
}
```

## Визуальный дизайн

### Расположение элементов на карточке:
```
┌─────────────────────────────────┐
│ ❤️                   ⏱️ 5 min   │  ← Избранное (слева), время чтения (вверху справа)
│                                 │
│      [Изображение сказки]       │
│                                 │
│                           🎧    │  ← НОВЫЙ: Индикатор аудио (внизу справа)
├─────────────────────────────────┤
│ Название сказки                 │
│ Описание сказки...              │
│ 👶 3-5  #сказка                 │
└─────────────────────────────────┘
```

### Цветовая схема:
- **Индикатор аудио**: зеленый круг (#10B981)
- **Иконка**: белый цвет наушников
- **Тень**: легкая тень для контрастности

## Преимущества реализации

### 1. **Производительность**
- ✅ Индекс на `hasAudio` для быстрых запросов
- ✅ Данные загружаются одним запросом вместе с историей
- ✅ Не требуется дополнительных запросов к `story_audio`

### 2. **Надежность**
- ✅ Триггер автоматически обновляет статус при изменениях
- ✅ Всегда актуальная информация
- ✅ Меньше вероятность рассинхронизации данных

### 3. **UX**
- ✅ Пользователь сразу видит, у каких историй есть аудио
- ✅ Интуитивный индикатор (иконка наушников)
- ✅ Не перегружает интерфейс

### 4. **Масштабируемость**
- ✅ Работает для любого количества языков
- ✅ Легко добавить фильтрацию по наличию аудио
- ✅ Готово к будущим улучшениям

## Как проверить работу

### 1. В базе данных (Supabase SQL Editor):
```sql
-- Проверить статистику
SELECT 
    language,
    COUNT(*) as всего,
    SUM(CASE WHEN hasaudio = true THEN 1 ELSE 0 END) as с_аудио
FROM story_translation
GROUP BY language;
```

### 2. В приложении:
1. Откройте экран со списком историй
2. Найдите историю с аудио
3. Проверьте наличие зеленого круглого значка с иконкой наушников в правом нижнем углу изображения

### 3. Тестирование триггера:
```sql
-- Добавьте аудио для истории
INSERT INTO story_audio (story_id, language, audio_url, mime_type)
VALUES ('your-story-id', 'en', 'https://...', 'audio/mpeg');

-- Проверьте, что hasaudio обновился автоматически
SELECT hasaudio FROM story_translation 
WHERE story_id = 'your-story-id' AND language = 'en';
-- Должно вернуть: true
```

## SQL скрипты для управления

### Просмотр триггеров:
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'trigger_update_hasaudio';
```

### Удаление триггера (если нужно):
```sql
DROP TRIGGER IF EXISTS trigger_update_hasaudio ON story_audio CASCADE;
DROP FUNCTION IF EXISTS update_story_translation_hasaudio() CASCADE;
```

### Пересоздание данных:
```sql
-- Если нужно пересчитать hasaudio для всех записей
UPDATE story_translation st
SET hasaudio = EXISTS (
    SELECT 1 FROM story_audio sa
    WHERE sa.story_id = st.story_id 
    AND sa.language = st.language
);
```

## Дальнейшие улучшения

### Возможные дополнения:
1. **Фильтр "Только с аудио"** - уже реализован в `useStories` хуке
2. **Индикатор длительности аудио** - показывать продолжительность аудио
3. **Статус загрузки** - показывать, скачано ли аудио офлайн
4. **Анимация** - добавить пульсацию или другую анимацию к индикатору

## Файлы, которые были изменены

1. **Database Schema** (выполнить SQL в Supabase):
   - Добавлена колонка `hasAudio`
   - Созданы индексы
   - Создан триггер

2. **TypeScript Types**:
   - `bedtime_stories_app/src/types/index.ts`

3. **API Service**:
   - `bedtime_stories_app/src/services/supabase.ts`

4. **UI Components**:
   - `bedtime_stories_app/src/components/StoryCard.tsx`

5. **Hooks**:
   - `bedtime_stories_app/src/hooks/useStories.ts`

## Техническая документация

### Зависимости:
- React Native
- react-native-paper
- @expo/vector-icons (Ionicons)
- Supabase PostgreSQL

### Версии:
- TypeScript: ^5.x
- React Native: ^0.72.x

---

**Дата реализации**: 2025-10-07
**Статус**: ✅ Завершено и протестировано

