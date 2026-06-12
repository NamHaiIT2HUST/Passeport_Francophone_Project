import Phaser from 'phaser';

export default class RoundtableScene extends Phaser.Scene {
  constructor() {
    super('RoundtableScene');
    this.levelId = 'mada';
    this.persuasionScore = 0;
    this.inventory = [];
    this.roundData = null;
    this.scoreText = null;
    this.npcText = null;
    this.resultText = null;
    this.finishButton = null;
    this.evidenceButtons = [];
    this.roundResolved = false;
  }

  init(data) {
    this.levelId = data.levelId ?? 'mada';
    this.persuasionScore = data.score ?? 50;
    this.inventory = data.inventory ?? [];
    this.roundData = null;
    this.roundResolved = false;
    this.finishButton = null;
    this.evidenceButtons = [];
  }

  create() {
    const roundsData = this.cache.json.get('rounds') ?? {};
    this.roundData = roundsData[`${this.levelId}_round_1`] ?? Object.values(roundsData)[0];

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

    this.npcText = this.add
      .text(640, 260, this.roundData?.npc_text ?? 'Aucun débat disponible.', {
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
        score: this.persuasionScore
      });
    });
  }

  handleEvidenceChoice(item) {
    if (this.roundResolved || !this.roundData) {
      return;
    }

    if (item.id === this.roundData.correct_item) {
      this.roundResolved = true;
      this.npcText.setVisible(false);
      this.resultText.setText(this.roundData.win_text);
      this.persuasionScore += this.roundData.score_change ?? 20;
      this.evidenceButtons.forEach((button) => button.disableInteractive());
    } else {
      this.resultText.setText(this.roundData.lose_text);
      this.persuasionScore -= 10;
    }

    this.scoreText.setText(`Persuasion Score: ${this.persuasionScore}`);
    this.finishButton.setVisible(true);
  }
}

