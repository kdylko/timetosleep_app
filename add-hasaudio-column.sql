-- ========================================
-- Добавление колонки hasaudio в story_translation
-- ========================================
-- ВАЖНО: В PostgreSQL имена колонок автоматически приводятся к lowercase
-- Поэтому используем hasaudio, а не hasAudio

-- Шаг 1: Добавляем колонку (если её ещё нет)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'story_translation' 
        AND column_name = 'hasaudio'
    ) THEN
        ALTER TABLE story_translation 
        ADD COLUMN hasaudio BOOLEAN DEFAULT false NOT NULL;
        
        RAISE NOTICE 'Колонка hasaudio успешно добавлена';
    ELSE
        RAISE NOTICE 'Колонка hasaudio уже существует';
    END IF;
END $$;

-- Шаг 2: Создаём индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_story_translation_hasaudio 
ON story_translation(hasaudio);

CREATE INDEX IF NOT EXISTS idx_story_translation_language_hasaudio 
ON story_translation(language, hasaudio);

-- Шаг 3: Обновляем значения hasaudio на основе существующих аудио
UPDATE story_translation st
SET hasaudio = true
WHERE EXISTS (
    SELECT 1 
    FROM story_audio sa
    WHERE sa.story_id = st.story_id 
    AND sa.language = st.language
);

UPDATE story_translation st
SET hasaudio = false
WHERE NOT EXISTS (
    SELECT 1 
    FROM story_audio sa
    WHERE sa.story_id = st.story_id 
    AND sa.language = st.language
);

-- Шаг 4: Создаём функцию для автоматического обновления
CREATE OR REPLACE FUNCTION update_story_translation_hasaudio()
RETURNS TRIGGER AS $$
BEGIN
    -- При INSERT или UPDATE в story_audio - ставим hasaudio = true
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE story_translation
        SET hasaudio = true
        WHERE story_id = NEW.story_id 
        AND language = NEW.language;
        RETURN NEW;
    END IF;
    
    -- При DELETE из story_audio - проверяем и обновляем
    IF (TG_OP = 'DELETE') THEN
        UPDATE story_translation
        SET hasaudio = false
        WHERE story_id = OLD.story_id 
        AND language = OLD.language
        AND NOT EXISTS (
            SELECT 1 FROM story_audio 
            WHERE story_id = OLD.story_id 
            AND language = OLD.language
        );
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Шаг 5: Создаём триггер
DROP TRIGGER IF EXISTS trigger_update_hasaudio ON story_audio;

CREATE TRIGGER trigger_update_hasaudio
AFTER INSERT OR UPDATE OR DELETE ON story_audio
FOR EACH ROW
EXECUTE FUNCTION update_story_translation_hasaudio();

-- Шаг 6: Добавляем комментарии для документации
COMMENT ON COLUMN story_translation.hasaudio IS 
'Указывает, имеет ли данный перевод сказки аудио версию';

COMMENT ON FUNCTION update_story_translation_hasaudio() IS 
'Автоматически обновляет hasaudio в story_translation при изменениях в story_audio';

-- Шаг 7: Показываем статистику
SELECT 
    'Статистика по аудио:' as info;

SELECT 
    language as язык,
    COUNT(*) as всего_переводов,
    SUM(CASE WHEN hasaudio = true THEN 1 ELSE 0 END) as с_аудио,
    SUM(CASE WHEN hasaudio = false THEN 1 ELSE 0 END) as без_аудио,
    ROUND(
        (SUM(CASE WHEN hasaudio = true THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 
        2
    ) as процент_с_аудио
FROM story_translation
GROUP BY language
ORDER BY language;

-- Проверка триггера
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'trigger_update_hasaudio';

SELECT '✅ Миграция завершена успешно!' as status;

