export const useCalculator = () => {
  const specializations = {
    damage: {
      behemoth: 10,
      'ancient behemoth': 10,
      'earth elemental': 5,
      'magma elemental': 5,
      'fire elemental': 2,
      'energy elemental': 2
    },
    attack: {
      devil: 4,
      'arch devil': 4,
      behemoth: 5,
      'ancient behemoth': 5,
      'psychic elemental': 3,
      'magic elemental': 3,
      'water elemental': 2,
      'ice elemental': 2,
      'earth elemental': 2,
      'magma elemental': 2,
      'fire elemental': 1,
      'energy elemental': 1
    },
    defense: {
      behemoth: 5,
      'ancient behemoth': 5,
      'psychic elemental': 3,
      'magic elemental': 3,
      devil: 2,
      'arch devil': 2,
      'fire elemental': 2,
      'energy elemental': 2,
      'earth elemental': 1,
      'magma elemental': 1
    },
    hatred: [
      { 1: ['angel', 'archangel'], 2: ['devil', 'arch devil'], value: 1.5 },
      { 1: ['genie', 'master genie'], 2: ['efreet', 'efreet sultan'], value: 1.5 },
      { 1: ['titan'], 2: ['black dragon'], value: 1.5 },
      { 1: ['air elemental', 'storm elemental'], 2: ['earth elemental', 'magma elemental'], value: 2 },
      { 1: ['water elemental', 'ice elemental'], 2: ['fire elemental', 'energy elemental'], value: 2 }
    ]
  }

  const getMD_bas = (l, r, D_bas) => {
    const lName = l.selected.name_en
    const rName = r.selected.name_en
    const heroAttack = l.withHero ? +l.heroAttack : 0
    const heroDefense = r.withHero ? +r.heroDefense : 0
    const lNativeLand = l.nativeLand ? 1 : 0
    const rNativeLand = r.nativeLand ? 1 : 0

    // Behemoth ability
    let defAbility = 0
		if (lName === 'behemoth') defAbility = Math.ceil(0.4 * (+r.selected.defense + heroDefense) - 1)
    else if (lName === 'ancient behemoth') defAbility = Math.ceil(0.8 * (+r.selected.defense + heroDefense) - 1)

    // Halfling ability
		if (lName === 'halfling grenadier') defAbility = Math.ceil(0.2 * (+r.selected.defense + heroDefense) - 1)

    // Nix ability
    let offAbility = 1
		if (rName === 'nix') offAbility = 0.7
    else if (rName === 'nix warrior') offAbility = 0.4

    let lSpecs = 0
    if (l.withHero && l.unitSpec) {
      if (lName.includes('dragon')) lSpecs = 5
      else lSpecs = specializations.attack[lName] ?? 0
    }
    let rSpecs = 0
    if (r.withHero && r.unitSpec) {
      if (rName.includes('dragon')) rSpecs = 5
      else rSpecs = specializations.defense[rName] ?? 0
    }

    const mobAttack = Math.ceil(+l.selected.attack * getSpecialization(l))
    const mobDefense = Math.ceil(+r.selected.defense * getSpecialization(r))

		const attack = Math.floor((mobAttack + heroAttack + lNativeLand + lSpecs) * offAbility)
		let defense = Math.floor(mobDefense + heroDefense + rNativeLand + rSpecs - defAbility)

		if (r.protectStand) defense *= 1.2

		if (attack - defense > 0) {
			const result = (attack - defense) * 0.05 * D_bas
			return result > D_bas * 3 ? D_bas * 3 : result
		} else if (attack - defense < 0) {
			const result = (attack - defense) * 0.025 * D_bas
			return result < D_bas * -0.7 ? D_bas * -0.7 : result
		} else {
			return 0
		}
	}

  const getM_of = (l, D_bas) => {
		if (!l.offense) return 0

		let skillLvl
		switch (l.offense) {
			case 'basic':
				skillLvl = 0.1
				break
			case 'advanced':
				skillLvl = 0.2
				break
			case 'expert':
				skillLvl = 0.3
				break
		}

		if (l.offenseSpec) return skillLvl * (1 + 0.05 * +l.heroLevel) * D_bas
    return skillLvl * D_bas
	}

  const getM_ar = (l, D_bas) => {
		if (!l.archery) return 0

		let skillLvl
		switch (l.archery) {
			case 'basic':
				skillLvl = 0.1
				break
			case 'advanced':
				skillLvl = 0.25
				break
			case 'expert':
				skillLvl = 0.5
				break
		}

		if (l.archerySpec) return skillLvl * (1 + 0.05 * +l.heroLevel) * D_bas
    return skillLvl * D_bas
	}

  const getM_def = (r) => {
		if (!r.armor) return 0

		let skillLvl
		switch (r.armor) {
			case 'basic':
				skillLvl = 0.05
				break
			case 'advanced':
				skillLvl = 0.1
				break
			case 'expert':
				skillLvl = 0.15
				break
		}

		if (r.armorSpec) return skillLvl * (1 + 0.05 * +r.heroLevel)
    return skillLvl
	}

  const getSpecialization = (item) => {
    if (
      !item.withHero ||
      !item.unitSpec ||
      specializations.attack[item.selected.name_en] ||
      item.selected.name_en.includes('dragon')
    ) return 1

    const mobLevel = +item.selected.level.substring(0, 1)
    if (mobLevel === 1) return item.heroLevel * 0.05 + 1
    const levelRatio = Math.floor(item.heroLevel / mobLevel)
    if (!levelRatio) return 1
    return levelRatio * 0.05 + 1
	}

  const getFines = (l) => {
    if (!isFinite(l.selected.shoots) || !l.fines) return 1
		switch (l.fines) {
      case 'melee':
      case 'distance':
      case 'town walls':
        return 0.5
      case 'distance + walls':
        return 0.25
    }
	}

  const getMultiplier = (l, r) => {
    if (!l || !r) return 1
    for (const item of specializations.hatred) {
      if (
        (item[1].includes(l) && item[2].includes(r)) ||
        (item[2].includes(l) && item[1].includes(r))
      ) return item.value
    }
    // Psychic and Magic elemental ability
    if (
      (l === 'psychic elemental' && ['giant', 'titan', 'black dragon'].includes(r)) ||
      (l === 'magic elemental' && ['magic elemental', 'black dragon'].includes(r))
    ) return 0.5
    return 1
  }

  const calculate = (left, right) => {
    const l = left.selected
    const r = right.selected
    if (!l || !r) return {}

    let specDmgBonus = 0
    if (left.withHero && left.unitSpec) specDmgBonus = specializations.damage[l.name_en] ?? 0

    const D_min = +l.min_damage + specDmgBonus
    const D_max = +l.max_damage + specDmgBonus

    const MDbas_min = getMD_bas(left, right, D_min)
    const MDbas_max = getMD_bas(left, right, D_max)

    const Mof_min = isFinite(l.shoots) ? 0 : getM_of(left, D_min)
    const Mof_max = isFinite(l.shoots) ? 0 : getM_of(left, D_max)

    const Mar_min = isFinite(l.shoots) ? getM_ar(left, D_min) : 0
    const Mar_max = isFinite(l.shoots) ? getM_ar(left, D_max) : 0

    const Mdef = getM_def(right)
    const fines = getFines(left)

    const multiplier = getMultiplier(l.name_en, r.name_en)

    const minTotalDamage = ((D_min + MDbas_min + Mof_min + Mar_min) * (1 - Mdef)) * fines * +left.quantity * multiplier
    const maxTotalDamage = ((D_max + MDbas_max + Mof_max + Mar_max) * (1 - Mdef)) * fines * +left.quantity * multiplier

    return {
      min: +minTotalDamage,
      max: +maxTotalDamage
    }
  }

  return { calculate }
}
