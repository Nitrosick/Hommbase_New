export const associations = {
  'mobs': ['мобы', 'существа', 'монстры', 'юниты', 'статы мобов', 'характеристики существ', 'mobs', 'units', 'monsters', 'creatures', 'enemies'],
  'comparator': ['сравнить существ', 'сопоставить существ', 'компаратор', 'comparing', 'matching', 'stronger unit'],
  'damagecalc': ['калькулятор урона', 'расчитать урон', 'calculate damage', 'how much damage'],
  'artifacts': ['артефакты', 'арты', 'лут', 'шмот', 'оружие', 'броня', 'кольца', 'амулеты', 'artefacts', 'relics', 'weapon', 'armor', 'necklects', 'items', 'loot', 'rings', 'talismans', 'books', 'chest', 'head', 'hands', 'offhand', 'shield', 'gauntlets', 'glowes', 'boots', 'cloak', 'sword', 'orbs', 'amulet'],
  'heroes': ['герои', 'чары', 'чемпионы', 'персонажи', 'персы', 'стартовая армия', 'биография', 'heroes', 'champions', 'characters', 'biography', 'starting army', 'starting stats', 'heroes specialty'],
  'spells': ['заклинания', 'спеллы', 'магия', 'вода', 'огонь', 'земля', 'воздух', 'spells', 'magic', 'abiliteis', 'enchantment', 'sorcery', 'fire', 'water', 'earth', 'air', 'mana cost', 'spell sost', 'spell affinity'],
  'objects': ['игровые объекты', 'объекты', 'сокровищницы', 'двелл', 'карта приключений', 'жилища', 'шахты', 'порталы', 'dwellings', 'objects', 'treasury', 'vaults', 'adventure map', 'mines', 'portals', 'outposts'],
  'maps': ['карты', 'мапы', 'пользовательские карты', 'кастомные карты', 'скачать карты', 'custom maps', 'download maps'],
  'soft': ['софт', 'программы', 'утилиты', 'патчи', 'проги', 'дополнения', 'hota скачать', 'герои 3 скачать', 'software', 'programs', 'patches', 'updates', 'download hota'],
  'towns': ['города', 'замки', 'постройки', 'цепочка построек', 'карта загадки', 'towns', 'castles', 'town buildings', 'building order', 'grail maps', 'town units', 'town heroes', 'town music theme', 'town description'],
  'editor': ['редактор карт', 'гайд по редактору', 'создание карт', 'map editor guide', 'custom maps creation', 'map editor tutorial'],
  'editor?alias=1': ['кнопки редактора', 'панели редактора', 'map editor panel'],
  'editor?alias=2': ['работа с почвой и рельефом', 'ground editing', 'soil editing', 'land editing'],
  'editor?alias=3': ['размещение объектов', 'редактирование объектов', 'object placement', 'object editing'],
  'editor?alias=4': ['настройки карты', 'спецификации карты', 'map settings'],
  'editor?alias=5': ['идеи для карт', 'приемы создания карт', 'custom maps patterns', 'custom maps examples'],
  'mechanics': ['механики игры', 'секреты', 'хитрости', 'информация по игре', 'game mechanics', 'hidden mechanics'],
  'mechanics?alias=atk_dfs_dmg': ['урон', 'атака', 'защита', 'рассчет урона', 'offence', 'deffence', 'attack', 'protection', 'resist', 'damage calculation'],
  'mechanics?alias=atk_dfs_dmg.3': ['модификаторы урона', 'damage modifier'],
  'mechanics?alias=atk_dfs_dmg.8': ['отрицательные параметры', 'характеристики ниже нуля', 'negative characteristics'],
  'mechanics?alias=luck_morale': ['удача', 'боевой дух', 'мораль', 'дополнительный ход', 'пропуск хода', 'luck', 'morale'],
  'mechanics?alias=archery': ['стрельба', 'archery'],
  'mechanics?alias=archery.2': ['штрафы стрельбы', 'shooting penalty'],
  'mechanics?alias=archery.4': ['блокирование', 'shooters blocking'],
  'mechanics?alias=health': ['здоровье существ', 'хп', 'хиты', 'hp', 'health points', 'resilience'],
  'mechanics?alias=move_speed': ['скорость существ', 'передвижение', 'очки передвижения', 'штрафы местности', 'unit movement', 'ground penalty'],
  'mechanics?alias=move_speed.2': ['запас хода', 'мп', 'дороги', 'movement points', 'roads'],
  'mechanics?alias=move_speed.4': ['посещение объектов', 'разгон', 'разведка', 'objects attending', 'movement boost', 'scouting'],
  'mechanics?alias=ai': ['ии', 'компьютерный игрок', 'искуственный интеллект', 'уровень сложности', 'сложность', 'поведение ии', 'computer ai', 'game difficulty', 'ai behaviour'],
  'mechanics?alias=ai.4': ['агрессия', 'ai aggression'],
  'mechanics?alias=ai.5': ['выбор заклинаний ии', 'ценность заклинаний', 'ai spell choice', 'ai spell value'],
  'mechanics?alias=ai.8': ['движение ии в бою', 'ai movement'],
  'mechanics?alias=battle_basics': ['основы сражения', 'бой', 'битва', 'battle tutorial', 'fight tutorial'],
  'mechanics?alias=battle_basics.1': ['поле боя', 'группировка', 'сосредоточение', 'строй', 'battlefield', 'formation'],
  'mechanics?alias=battle_basics.2': ['препятствия в бою', 'закрытые гексы', 'изолированные гексы', 'генерация поля боя', 'battlefield objects', 'battlefield generation'],
  'mechanics?alias=battle_basics.3': ['разделение отрядов', 'army splitting'],
  'mechanics?alias=battle_basics.4': ['сбежать', 'побег', 'откупиться', 'капитуляция', 'сдаться', 'surrender', 'buyout'],
  'mechanics?alias=battle_basics.5': ['подождать', 'защититься', 'укрепить позицию', 'to wait', 'to defend'],
  'mechanics?alias=battle_basics.6': ['захват сокровищниц', 'пробитие охраны', 'treasure battle'],
  'mechanics?alias=battle_basics.8': ['порядок ходов', 'перемещение в бою', 'раунды битвы', 'turn order on battlefield', 'battle rounds'],
  'mechanics?alias=growth': ['прирост существ', 'базовый прирост', 'население', 'unit population growth'],
  'mechanics?alias=growth.2': ['недели существ', 'месяцы существ', 'чума', 'недели чумы', 'plague week', 'unit week', 'unit month'],
  'mechanics?alias=status': ['статус существ', 'нежить', 'големы', 'живые существа', 'горгульи', 'элементали', 'unit status', 'undead', 'golems', 'alive', 'gargoyle', 'elementals'],
  'mechanics?alias=land': ['почва', 'родная земля', 'местность', 'homeland', 'homeground'],
  'mechanics?alias=ctrstrike': ['контратака', 'контрудар', 'ответка', 'сдача', 'counterstrike', 'counterpunch'],
  'mechanics?alias=hatred': ['ненависть', 'заклятые враги', 'антагонисты', 'antagonism'],
  'mechanics?alias=neutralize': ['нейтрализация заклинаний', 'сопротивление магии', 'magic neutralisation', 'magic resistance'],
  'mechanics?alias=absorption': ['поглощение', 'резист', 'снижение урона', 'damage absorbtion'],
  'mechanics?alias=firebreath': ['огненное дыхание', 'дыхание драконов', 'прожиг', 'массовая атака', 'фэйк прожиг', 'разворот и атака', 'dragons breath', 'splash attack', 'fake splash attack'],
  'mechanics?alias=mob_skills': ['способности существ', 'скиллы мобов', 'особенности существ', 'рут', 'заклинания существ', 'units abilites', 'root', 'blind'],
  'mechanics?alias=mob_skills.2': ['воскрешение', 'ressurection'],
  'mechanics?alias=mob_skills.9': ['яд', 'старость', 'poison', 'senescence', 'ageing'],
  'mechanics?alias=mob_skills.4': ['стан', 'паралич', 'окаменение', 'stun', 'petrification', 'paralyze'],
  'mechanics?alias=combat_veh': ['боевые машины', 'осадные машины', 'машины', 'siege machinery', 'siege engines'],
  'mechanics?alias=combat_veh.1': ['катапульта', 'catapult'],
  'mechanics?alias=combat_veh.2': ['баллиста', 'ballista'],
  'mechanics?alias=combat_veh.3': ['пушка', 'cannon'],
  'mechanics?alias=combat_veh.4': ['палатка', 'tent'],
  'mechanics?alias=combat_veh.5': ['подвода с боеприпасами', 'тележка', 'ammunition cart'],
  'mechanics?alias=spells': ['механика заклинаний', 'особенности заклинаний', 'spell mechanics', 'spell tips'],
  'mechanics?alias=spells.2': ['стена огня', 'огненная стена', 'стенка', 'fire wall', 'wall of fire'],
  'mechanics?alias=spells.3': ['берсерк', 'berserk'],
  'mechanics?alias=spells.4': ['огненный щит', 'щит огня', 'щит ифритов', 'fire shield', 'efreet shield'],
  'mechanics?alias=spells.5': ['телепорт', 'блинк', 'teleport'],
  'mechanics?alias=spells.6': ['клон', 'двойник', 'clone', 'kagebunshin-no-jutsu'],
  'mechanics?alias=spells.7': ['маскировка', 'disguise'],
  'mechanics?alias=spells.8': ['гипноз', 'контроль', 'hypnosis'],
  'mechanics?alias=spells.9': ['цепная молния', 'чайник', 'chain lightning'],
  'mechanics?alias=spells.10': ['полет', 'флай', 'fly'],
  'mechanics?alias=spells.11': ['антимагия', 'antimagic'],
  'mechanics?alias=spells.12': ['силовое поле', 'форс филд', 'force field'],
  'mechanics?alias=spells.13': ['заклинания на землю', 'устанавливаемые заклинания', 'ground based spells'],
  'mechanics?alias=specialize': ['специализации героев', 'специализация по заклинаниям', 'heroes specialty', 'spell specialty'],
  'mechanics?alias=primary': ['первичные навыки', 'статы героев', 'основные параметры', 'мана', 'primary characteristics', 'primary stats', 'base characteristics', 'base stats'],
  'mechanics?alias=secondary': ['вторичные навыки', 'умения героев', 'скиллы героев', 'secondary skills', 'hero skills', 'hero abilities'],
  'mechanics?alias=classes': ['классы героев', 'heroes classification'],
  'mechanics?alias=grail.1': ['грааль', 'раскопки грааля', 'grail', 'serching and digging the grail'],
  'mechanics?alias=grail.2': ['храм грааля', 'grail temple', 'grail building'],
  'mechanics?alias=fortification': ['фортификации', 'осада города', 'штурм города', 'городские укрепления', 'оборонные сооружения', 'town fortification', 'town siege'],
  'mechanics?alias=fortification.1': ['стены города', 'ворота', 'town walls', 'town gates'],
  'mechanics?alias=fortification.2': ['стрелковые башни', 'town towers'],
  'mechanics?alias=fortification.3': ['ров', 'мины', 'town mines', 'ditch', 'trench'],
  'mechanics?alias=start_bonuses': ['стартовые бонусы', 'выбор бонуса', 'start bonus choise'],
  'mechanics?alias=art_orb_vulnerability': ['сфера уязвимости', 'уязвимость к заклинаниям', 'orb of vulnerability', 'spell vulnerability'],
  'mechanics?alias=cheats': ['читы', 'коды', 'cheat codes'],
  'mechanics?alias=hotkeys': ['горячие клавиши', 'комбинации клавиш', 'быстрые действия', 'hot keys', 'quick action keys'],
  'mechanics?alias=arena': ['режим арена', 'arena maps'],
  'about': ['о проекте', 'о сайте hommbase', 'наша миссия', 'about us', 'about project', 'hommbase', 'about hommbase'],
  'community': ['игровые сообщества', 'сообщества героев 3', 'сайты по героям 3', 'стримы', 'форумы', 'community', 'heroes 3 youtube', 'heroes 3 twitch', 'heroes 3 forums'],
  'community?alias=updates': ['обновления игры', 'фиксы и патчи', 'game updates', 'game fixes'],
  'tests': ['тесты', 'викторина', 'челлендж', 'quiz', 'game knowledge tests'],
  'records': ['результаты тестов', 'таблица рекордов', 'лучшие результаты', 'table of records', 'best results'],
  'auth/profile': ['профиль пользователя', 'личный кабинет', 'сменить аватар', 'my profile', 'change profile picture']
}
