<div align="center">

# 🧠 Dopamine Focus App

<img width="550" src="https://github.com/user-attachments/assets/d028fe09-220c-4535-bf29-7716e7df0094" alt="Dopamine Focus App Cover" />

<p align="center">
  <b>Gamified Task Manager designed for ADHD brains.</b><br>
  Gerenciador de tarefas gamificado projetado para cérebros com TDAH.
</p>

<p align="center">
  <a href="#-português">🇧🇷 Leia em Português</a> •
  <a href="#-english">🇺🇸 Read in English</a>
</p>

</div>

---

<div id="-português"></div>

## 🇧🇷 Português

### 🤯 O Problema

Para pessoas neurodivergentes (especialmente TDAH), listas de tarefas comuns podem ser opressoras. A "paralisia executiva" muitas vezes nos impede de começar, e a falta de recompensas imediatas torna difícil manter o foco. Além disso, usar o navegador para gerenciar tarefas é um convite para distrações (olá, abas do YouTube!).

### 🚀 A Solução

O **Dopamine Focus** é um aplicativo Desktop que isola o ambiente de trabalho. Ele aplica conceitos de **Gamificação**, **Ruído Sensorial** e **Redução de Atrito** para "enganar" o cérebro a produzir dopamina antes, durante e depois da tarefa.

> "Não é sobre organização, é sobre motivação química."

### ✨ Funcionalidades Principais

| Feature                      | Como ajuda o TDAH?                                                                                                               |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **🎁 Loot Box System**       | Escolha entre recompensa fixa ou "Sorteio" ao final das tarefas. A incerteza gera picos maiores de dopamina (Gamificação).       |
| **🎨 Temas Desbloqueáveis**  | Complete sessões para desbloquear visuais novos (Neon, Coffee Shop). Cria um senso de progresso e recompensa de longo prazo.     |
| **🚨 Botão de Pânico (SOS)** | Travou? O botão oferece saídas estratégicas: _"Só 5 minutos"_, _"Respirar"_ ou _"Desafio Fácil"_. Combate a paralisia sem culpa. |
| **🎧 Ruído Marrom (Player)** | Player nativo de Brown Noise (Ruído Marrom). Isola o "ruído mental" e ajuda na regulação sensorial.                              |
| **⏳ Timer Visual**          | Uma barra de progresso física que diminui e muda de cor. Combate a "cegueira temporal" tornando a passagem do tempo visível.     |
| **🕶️ Focus Mode**            | A lista some. Você vê apenas UMA tarefa gigante, o timer e o player. Reduz a ansiedade visual.                                   |

### 🛠️ Tecnologias

- **Electron:** Para criar a experiência nativa Desktop.
- **React:** Gerenciamento de estado e interface reativa.
- **Tailwind CSS:** Estilização rápida e moderna.

### 💻 Como Rodar o Projeto

Você precisará do [Node.js](https://nodejs.org/) instalado.

1.  **Clone o repositório**

    ```bash
    git clone [https://github.com/InRenck/DopamineFocus-App.git](https://github.com/InRenck/DopamineFocus-App.git)
    cd dopamine-focus-app
    ```

2.  **Instale as dependências**

    ```bash
    npm install
    ```

3.  **Adicione os Áudios**
    Adicione dois arquivos `.mp3` na raiz do projeto: `brown_noise.mp3` e `alarm.mp3`.

4.  **Rode em modo de desenvolvimento**

    ```bash
    npm start
    ```

5.  **Gere o Executável (.exe)**
    Para criar o instalador do Windows:
    ```bash
    npm run build
    ```

---

<div id="-english"></div>

## 🇺🇸 English

### 🤯 The Problem

For neurodivergent people (especially with ADHD), standard to-do lists can be overwhelming. "Executive paralysis" often stops us from starting, and the lack of immediate rewards makes it hard to maintain focus. Plus, using a browser to manage tasks is an invitation for distractions (hello, YouTube tabs!).

### 🚀 The Solution

**Dopamine Focus** is a Desktop app that isolates your workspace. It applies **Gamification**, **Sensory Noise**, and **Friction Reduction** concepts to trick the brain into producing dopamine before, during, and after tasks.

> "It's not about organization, it's about chemical motivation."

### ✨ Key Features

| Feature                   | ADHD Tactic                                                                                                                    |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------- |
| **🎁 Loot Box System**    | Choose between a fixed reward or a "Lucky Draw". Uncertainty creates higher dopamine spikes (Gamification).                    |
| **🎨 Unlockable Themes**  | Complete focus sessions to unlock new skins (Neon, Coffee Shop). Creates long-term progress rewards.                           |
| **🚨 Panic Button (SOS)** | Stuck? The button offers strategic exits: _"Just 5 mins"_, _"Breathe"_, or _"Easy Challenge"_. Fights paralysis without guilt. |
| **🎧 Brown Noise Player** | Built-in Brown Noise player. Silences "mental noise" and aids sensory regulation.                                              |
| **⏳ Visual Timer**       | A physical progress bar that shrinks and changes color. Fights "time blindness" by making time visible.                        |
| **🕶️ Focus Mode**         | The list vanishes. You see only ONE giant task, the timer, and the player. Reduces visual anxiety.                             |

### 🛠️ Tech Stack

- **Electron:** To create a native Desktop experience.
- **React:** For reactive UI and state management.
- **Tailwind CSS:** For fast, modern styling.

### 💻 How to Run

You will need [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/InRenck/DopamineFocus-App.git](https://github.com/InRenck/DopamineFocus-App.git)
    cd dopamine-focus-app
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Add Audio Files**
    Place two `.mp3` files in the project root: `brown_noise.mp3` and `alarm.mp3`.

4.  **Run in development mode**

    ```bash
    npm start
    ```

5.  **Build Executable (.exe)**
    To create the Windows installer:
    ```bash
    npm run build
    ```

---

<div align="center">
  Made with 💜 and Hyperfocus by <a href="https://github.com/InRenck">InRenck</a>.
</div>
