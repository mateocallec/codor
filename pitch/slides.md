---
theme: apple-basic
title: Codor Pitch
class: intro
drawings:
  persist: false
transition: slide-left
mdc: true
duration: 2min
---

<div class="pt-50">

# Codor


### Intelligent Programming Education Platform

</div>

<div class="absolute bottom-10 flex flex-col">
  <span class="font-100">
    Hagenberger Fünfeck @ GDG
  </span>
  <span class="font-100">
    Track C: Next-Gen Education
  </span>
  <span class="font-100">
    Members: Daxerer Christoph, Karer Lukas, Jung Simon, Habermaeir Florentin, Callec Matéo
  </span>
</div>

---
layout: default
glowSeed: 18
---

# Programming Exercises in Education

<div class="mt-4 space-y-2">

<v-click>

<div class="flex items-center gap-6">
  <div class="text-5xl text-green-800 opacity-20 font-bold leading-none">01</div>
  <div class="flex-1 pt-2">
    <h3 class="text-2xl font-bold mb-1 text-green-700 opacity-100!">Exercise Creation</h3>
    <p class="text-lg leading-relaxed opacity-80">Creating quality programming exercises requires significant time investment for teachers.</p>
  </div>
</div>

</v-click>

<v-click>

<div class="flex items-center gap-6">
  <div class="text-5xl text-green-800 opacity-20 font-bold leading-none">02</div>
  <div class="flex-1 pt-2">
    <h3 class="text-2xl font-bold mb-3 text-green-700 opacity-100!">Individual Support</h3>
    <p class="text-lg leading-relaxed opacity-80">Supporting students 1 on 1 at home is basically impossible.</p>
  </div>
</div>

</v-click>

<v-click>

<div class="flex items-center gap-6">
  <div class="text-5xl text-green-800 opacity-20 font-bold leading-none">03</div>
  <div class="flex-1 pt-2">
    <h3 class="text-2xl font-bold mb-3 text-green-700 opacity-100!">Visibility Gap</h3>
    <p class="text-lg leading-relaxed opacity-80">What are students struggling with at home?</p>
  </div>
</div>

</v-click>

<v-click>

<div class="flex items-center gap-6">
  <div class="text-5xl text-green-800 opacity-20 font-bold leading-none">04</div>
  <div class="flex-1 pt-2">
    <h3 class="text-2xl font-bold mb-3 text-green-700 opacity-100!">Assessment Scale</h3>
    <p class="text-lg leading-relaxed opacity-80">Grading at scale takes a lot of time.</p>
  </div>
</div>

</v-click>

</div>

<!-- 
1. Creating quality programming exercises requires significant time investment for teachers. Many resort to reusing old exercises or finding them online, which may not align with current teaching goals.
2. Providing individualized support to students working on programming exercises at home is nearly impossible. Teachers cannot be available to assist each student when they encounter difficulties.
3. Students working at home is a blackbox for the teacher. Students already don't like admitting that they struggled and doing so in the next lesson is already one lesson too late to prepare for the teacher. 
4. Grading programming exercises at scale is time-consuming. Automated grading systems often lack the nuance to assess code quality and problem-solving approaches effectively.
-->

---

# Introducing Codor

<div class="text-xl mt-8">
An intelligent platform that transforms how programming exercises are created, assigned, and completed
</div>

<v-clicks>

<div class="mt-28 grid grid-cols-2 gap-4">

<div class="p-4 border rounded">

### For Educators
Upload solution code and generate structured exercises automatically

</div>

<div class="p-4 border rounded">

### For Students
Receive contextual guidance without direct solutions

</div>

</div>

</v-clicks>

---

# Creating an Assignment

<div class="mt-6">
  <img src="./images/tasks.png" class="mx-auto overflow-visible w-220" />
</div>

---

# Intelligent Guidance System

<div class="mt-6">
  <img src="./images/guidance.png" class="mx-auto overflow-visible w-220" />
</div>

---

# Analytics Dashboard

<div class="mt-6">
  <img src="./images/dashboard.png" class="mx-auto overflow-visible w-220" />
</div>

---

# Architecture

<div class="flex gap-8 mt-4">

<div class="flex-1">

### Current PoC

<div class="mt-6">
  <img src="./images/poc-diag.svg" class="mx-auto overflow-visible w-40" />
</div>

<div class="mt-4 text-sm opacity-80">

Simple stack, everything is in the frontend, POC life 🤟

</div>

</div>

<div class="flex-1">

### Production System

<div class="mt-4">
  <img src="./images/prod-diag.svg" class="overflow-visible w-full" />
</div>

<div class="mt-4 text-sm opacity-80">

Scalable Architecture:
- Microservices backend
- Kubernetes deployment
- Cloud CDN for frontend
- Sandboxed code execution
- SSO integration
- ...

</div>

</div>

</div>

---
layout: center
class: text-center
glowSeed: 225
---

# Codor

<div class="text-2xl mt-8 opacity-80">
Enhancing teaching effectiveness<br/>
Enabling independent learning
</div>

<div class="mt-16">
  <div class="text-3xl font-bold">
    Transforming Programming Education
  </div>
</div>

<div class="mt-12 text-lg opacity-60">
GDG DevFest Submission 2025
</div>
