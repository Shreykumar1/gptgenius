## GPT Genius

### [Watch the project demo](https://www.youtube.com/watch?v=JDY1cmDwSso)

![Screenshot 2024-08-29 224256](https://github.com/user-attachments/assets/72f1b41c-eecb-433b-aead-0501b061f2ff)

<p align="center">
  <img src="https://github.com/user-attachments/assets/a279e31d-528a-41ec-bd49-939b12fe6014" alt="Image 1" width="45%">
  <img src="https://github.com/user-attachments/assets/9532fe6a-e185-4115-a930-10e313391822" alt="Image 2" width="45%">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/fed391c0-4044-4f1f-96b2-faaacc446e07" alt="Image 1" width="45%">
  <img src="https://github.com/user-attachments/assets/5ae9579d-a1d4-4ebf-a25c-cc41c7355d97" alt="Image 2" width="45%">
</p>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Overview

GPTGenius is a cutting-edge web application that leverages advanced AI capabilities to provide an interactive chat experience, personalized tour generation, and landmark identification features. Built with Next.js and React, GPTGenius is designed to deliver high performance and a seamless user experience.

## Features

- **Authentication:** Secure user authentication with Clerk.js, including dark/light mode switching.
- **AI Chat:** Integrated with Google’s Gemini-1.5-Flash model for real-time, AI-driven conversations.
- **Tour Generation:** Create personalized tours based on user-provided city and country details, with image generation and cached results using React Query.
- **Tour Storage:** Efficiently stores tour data using PostgreSQL and Prisma ORM.
- **Landmark Identification:** Processes images of landmarks and provides detailed textual descriptions based on the landmark's features.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, DaisyUI
- **AI Integration:** Gemini GenAI (Google's Gemini-1.5-Flash model)
- **Backend:** PostgreSQL, Prisma ORM
- **Authentication:** Clerk.js

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shreykumar1/gptgenius.git
   cd gptgenius

