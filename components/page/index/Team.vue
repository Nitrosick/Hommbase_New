<template>
  <div class="team">
    <div class="team-card">
      <div class="team-photo">
        <img
          src="/images/team/unknown.webp"
          alt="team member"
          class="team-photo-img"
        >
      </div>
      <div class="team-card-name">
        <span class="nickname">Nitrosick</span>
        <br>
        <span class="fullname">{{ $t('team.author-1.name') }}</span>
      </div>
      <p class="team-card-role">
        {{ $t('team.author-1.role') }}
      </p>
    </div>
    <div class="team-card">
      <div class="team-photo">
        <img
          src="/images/team/unknown.webp"
          alt="team member"
          class="team-photo-img"
        >
      </div>
      <div class="team-card-name">
        <span class="nickname">Karisol</span>
        <br>
        <span class="fullname">{{ $t('team.author-2.name') }}</span>
      </div>
      <p class="team-card-role">
        {{ $t('team.author-2.role') }}
      </p>
    </div>
    <div class="team-card">
      <div class="team-photo">
        <img
          src="/images/team/unknown.webp"
          alt="team member"
          class="team-photo-img"
        >
      </div>
      <div class="team-card-name">
        <span class="nickname">???</span>
        <br>
        <span class="fullname">{{ $t('team.author-3.name') }}</span>
      </div>
      <p class="team-card-role">
        {{ $t('team.author-3.role') }}
      </p>
    </div>
    <div class="team-card team-card-links">
      <ClientOnly>
        <Links />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import Links from '@/components/page/index/Links.vue';
</script>

<style lang="scss" scoped>
.team {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  border: $border-main;
  border-top: none;
  background-color: var(--color-grey-1);

  &-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    background-color: $color-background;
    padding: 0 1.5rem;
    text-align: center;

    &-role {
      margin-bottom: 1.5rem;
      max-width: 20rem;
    }
  }

  &-card-links {
    @include breakpoint-xl {
      grid-column: 1/-1;
    }

    @include breakpoint-lg {
      grid-column: auto;
    }
  }

  &-photo {
    border: $border-main;
    border-top: none;
    width: 12rem;
    aspect-ratio: 4/5;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @include breakpoint-xl {
    grid-template-columns: repeat(3, 1fr);
  }

  @include breakpoint-lg {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  @include breakpoint-sm {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr) auto;
  }
}

.nickname {
  font-weight: 600;
  font-size: $font-size-lg;
  color: var(--color-gold-1);
  text-shadow: 3px 3px 0 var(--color-gold-3);
}

.fullname {
  font-weight: 600;
  color: var(--color-grey-1);
}
</style>
