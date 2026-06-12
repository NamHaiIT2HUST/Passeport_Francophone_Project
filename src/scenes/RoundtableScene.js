import Phaser from 'phaser';

export default class RoundtableScene extends Phaser.Scene {
  constructor() {
    super('RoundtableScene');
    this.levelId = 'mada';
    this.persuasionScore = 0;
    this.inventory = [];
    this.rounds = [];
    this.currentRoundIndex = 0;
    this.scoreText = null;
    this.roundCounterText = null;
    this.npcText = null;
    this.resultText = null;
    this.nextRoundButton = null;
    this.finishButton = null;
    this.evidenceButtons = [];
    this.roundResolved = false;
  }

  init(data) {
    this.levelId = data.levelId ?? 'mada';
    this.persuasionScore = data.score ?? 50;
    this.inventory = data.inventory ? [...data.inventory] : [];
    this.rounds = [];
    this.currentRoundIndex = 0;
    this.roundResolved = false;
    this.nextRoundButton = null;
    this.finishButton = null;
    this.evidenceButtons = [];
  }

  create() {
    const roundsData = this.cache.json.get('rounds') ?? {};
    this.rounds = roundsData[this.levelId] ?? [];

    this.cameras.main.setBackgroundColor('#22313f');

    this.scoreText = this.add.text(24, 24, `Persuasion Score: ${this.persuasionScore}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#00000099',
      padding: {
        x: 12,
        y: 8
      }
    });

    this.add
      .text(640, 88, 'Table Ronde', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '42px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    this.roundCounterText = this.add
      .text(640, 142, '', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        color: '#dddddd'
      })
      .setOrigin(0.5);

    this.npcText = this.add
      .text(640, 260, '', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '38px',
        color: '#ffffff',
        align: 'center',
        wordWrap: {
          width: 940
        }
      })
      .setOrigin(0.5);

    this.resultText = this.add
      .text(640, 340, '', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '34px',
        color: '#f4d35e',
        align: 'center',
        wordWrap: {
          width: 900
        }
      })
      .setOrigin(0.5);

    this.add.text(120, 460, 'Choisissez une preuve :', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#ffffff'
    });

    this.createEvidenceButtons();
    this.createReturnControls();
    this.renderCurrentRound();
  }

  get currentRound() {
    return this.rounds[this.currentRoundIndex];
  }

  renderCurrentRound() {
    this.roundResolved = false;
    this.resultText.setText('');
    this.nextRoundButton.setVisible(false);
    this.finishButton.setVisible(false);

    if (!this.currentRound) {
      this.npcText.setText('Aucun débat disponible.');
      this.evidenceButtons.forEach((button) => button.disableInteractive());
      this.finishButton.setVisible(true);
      return;
    }

    this.roundCounterText.setText(`Round ${this.currentRoundIndex + 1} / ${this.rounds.length}`);
    this.npcText.setVisible(true);
    this.npcText.setText(this.currentRound.npc_text);
    this.evidenceButtons.forEach((button) => button.setInteractive({ useHandCursor: true }));
  }

  createEvidenceButtons() {
    if (this.inventory.length === 0) {
      this.add.text(120, 520, 'Aucune preuve disponible.', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#dddddd'
      });
      return;
    }

    this.inventory.forEach((item, index) => {
      const y = 520 + index * 58;
      const evidenceButton = this.add
        .text(120, y, item.name, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          color: '#1d3557',
          backgroundColor: '#f4d35e',
          padding: {
            x: 16,
            y: 10
          },
          wordWrap: {
            width: 1000
          }
        })
        .setInteractive({ useHandCursor: true });

      evidenceButton.on('pointerdown', () => {
        this.handleEvidenceChoice(item);
      });

      this.evidenceButtons.push(evidenceButton);
    });
  }

  createReturnControls() {
    const returnButton = this.add
      .text(1248, 688, 'Retour à l’exploration', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        color: '#ffffff',
        backgroundColor: '#00000099',
        padding: {
          x: 14,
          y: 10
        }
      })
      .setOrigin(1, 1)
      .setInteractive({ useHandCursor: true });

    returnButton.on('pointerdown', () => {
      this.scene.start('GameScene', {
        levelId: this.levelId,
        score: this.persuasionScore,
        inventory: this.inventory
      });
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('GameScene', {
        levelId: this.levelId,
        score: this.persuasionScore,
        inventory: this.inventory
      });
    });

    this.nextRoundButton = this.add
      .text(640, 668, 'Round Suivant', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#1d3557',
        backgroundColor: '#f4d35e',
        padding: {
          x: 18,
          y: 12
        }
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    this.nextRoundButton.on('pointerdown', () => {
      this.currentRoundIndex += 1;
      this.renderCurrentRound();
    });

    this.finishButton = this.add
      .text(640, 668, 'Terminer la négociation', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#1d3557',
        backgroundColor: '#f4d35e',
        padding: {
          x: 18,
          y: 12
        }
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    this.finishButton.on('pointerdown', () => {
      this.scene.start('ResultScene', {
        levelId: this.levelId,
        score: this.persuasionScore
      });
    });
  }

  handleEvidenceChoice(item) {
    if (this.roundResolved || !this.currentRound) {
      return;
    }

    this.roundResolved = true;
    this.evidenceButtons.forEach((button) => button.disableInteractive());

    if (item.id === this.currentRound.correct_item) {
      this.npcText.setVisible(false);
      this.resultText.setText(this.currentRound.win_text);
      this.persuasionScore += this.currentRound.score_change ?? 20;
    } else {
      this.resultText.setText(this.currentRound.lose_text);
      this.persuasionScore -= 10;
    }

    this.scoreText.setText(`Persuasion Score: ${this.persuasionScore}`);

    if (this.currentRoundIndex < this.rounds.length - 1) {
      this.nextRoundButton.setVisible(true);
    } else {
      this.finishButton.setVisible(true);
    }
  }
}

