<script setup lang="ts">
import MonevTopicCard from './MonevTopicCard.vue'

interface TopicItem {
  key: string
  title: string
  description: string
  to: string
}

interface Props {
  topics: TopicItem[]
}

defineProps<Props>()
</script>

<template>
  <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <TransitionGroup
      enter-active-class="transition duration-400 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      appear
    >
      <MonevTopicCard
        v-for="(topic, index) in topics"
        :key="topic.key"
        :title="topic.title"
        :description="topic.description"
        :to="topic.to"
        :style="{ transitionDelay: `${index * 50}ms` }"
      />
    </TransitionGroup>
  </section>
</template>
