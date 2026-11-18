# Medozor website

Редизайн от 18.11.2026. Статическая главная для существующего GitHub Pages, без смены хостинга и домена.

## Направление

Медицинский журнал: тёплая бумага, тёмные чернила, бордовый акцент и тихий зелёный фон исследовательского раздела. Literata для заголовков, Golos Text для интерфейса. Шрифты и изображения хранятся локально.

Фирменный мотив — отсылки к источникам на полях. Фотографические сцены показывают внимание к учёбе и человеку. Реальные возможности прототипа отделены от планируемой платформы.

Публичная главная объясняет проект. Исходная зашифрованная страница перенесена без изменений в `research/index.html`. Существующая станция сохранена по `/prototype/`.

## Изображения

Pinterest в доступном окружении вернул оболочку без результатов. Фотографии с Pinterest не использованы. Две сцены созданы встроенным инструментом image_gen специально для проекта, затем сохранены в WebP в полном и уменьшенном размерах. Пометка о генерации доступна в подвале сайта. Изображения не показывают настоящих участников проекта.

Файлы:

- `assets/images/library.webp`, `library-small.webp`
- `assets/images/consultation.webp`, `consultation-small.webp`

Промпт первой сцены:

> Use case: editorial website photography. Asset type: Medozor Russian medical education research platform landing page, wide hero photograph, 3:2 landscape. Create one remarkably believable documentary editorial photograph, human and tactile, candid medical student studying at a pale oak desk in a quiet university library in late afternoon. A young adult woman seen from behind and slightly side-on in white medical coat over a dark muted burgundy sweater, dark brown hair loosely tied back, engrossed in an open medical textbook with subtle anatomical line illustrations and handwritten notes, a dark laptop nearby with no visible UI. Small stack of well-used neutral covered books. Soft daylight from tall windows at right, sage green library walls, warm ivory and dark wood, restrained analog editorial color, realistic skin, actual photographic depth, architectural calm, no glossy stock-photo smiles. Composition student and hands to right center, intimate crop from shoulder level with book foreground, enough environment to feel like a real moment, not staged. Fine photographic realism, 50mm lens. No logos, watermark, text overlays, no legible invented text, no medical procedure, no glowing AI effects, no grain pattern. Intended layout places this photograph next to large ink typography on ivory paper.

Промпт второй сцены:

> Editorial documentary photography for Medozor, a Russian medical learning research project website. One horizontal 3:2 landscape photograph, natural candid moment: older adult man in a muted olive knitted cardigan seated at a consultation desk, talking thoughtfully to a young medical student in ivory white coat seen over her shoulder at left foreground. Ordinary university clinical teaching room, quiet sage and ivory colors, soft large window light. The patient is listening and speaking, not distressed, no examination or procedures. Pale oak table, notebook and a single pen, tiny discreet stethoscope resting flat. Real skin texture, ordinary humans, natural asymmetrical composition, gentle contrast, emotionally credible, calm editorial magazine style, 50mm lens. Frame patient to the right two thirds with his hands visible naturally, student only partial left foreground. Deep burgundy accent on student's sweater cuff matching a thoughtful medical journal. No logos, no text, no UI, no glowing graphics, no forced smiles, no stock photo handshake, no grain or noise textures. Beautiful restrained photography with genuine sense of attention.

## Поведение

Мобильное меню закрывается по ссылке, Escape и клику вне шапки. Вкладки примера поддерживают стрелки, Home и End. Вопросы в примере показывают заранее написанные реплики и меняют соответствующий пункт чек-листа. Повторный клик не дублирует ответ. Кнопка сброса возвращает исходное состояние. Никаких внешних запросов или отправки пользовательских данных в этом примере нет.

## Credits

Шрифты: Golos Text и Literata, SIL Open Font License. Тексты лицензий лежат рядом с файлами шрифтов.

В работе использованы рекомендации unslop by Damir Sokolovsky, https://heydamir.design/unslop, CC BY 4.0. Дизайн, компоновка и графика сделаны для Medozor.
