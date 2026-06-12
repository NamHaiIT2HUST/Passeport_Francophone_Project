import Phaser from 'phaser';

const ROUND_DATA = {
  id: 'round_1',
  npc_text: 'Nous ne coupons que les vieux arbres malades !',
  correct_item_id: 'item_1',
  win_text: "D'accord, j'avoue...",
  lose_text: 'Ça ne prouve rien !'
};

export default class RoundtableScene extends Phaser.Scene {
  constructor() {
    super('RoundtableScene');
    this.persuasionScore = 0;
    this.inventory = [];
    this.scoreText = null;
    this.npcText = null;
    this.resultText = null;
    this.finishButton = null;
    this.evidenceButtons = [];
    this.roundResolved = false;
  }

  init(data) {
    this.persuasionScore = data.score ?? 50;
    this.inventory = data.inventory ?? [];
    this.roundResolved = false;
    this.finishButton = null;
    this.evidenceButtons = [];
  }

  create() {
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
      .text(640, 260, ROUND_DATA.npc_text, {
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
      this.scene.start('GameScene');
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('GameScene');
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
    if (this.roundResolved) {
      return;
    }

    if (item.id === ROUND_DATA.correct_item_id) {
      this.roundResolved = true;
      this.npcText.setVisible(false);
      this.resultText.setText(ROUND_DATA.win_text);
      this.persuasionScore += 20;
      this.evidenceButtons.forEach((button) => button.disableInteractive());
    } else {
      this.resultText.setText(ROUND_DATA.lose_text);
      this.persuasionScore -= 10;
    }

    this.scoreText.setText(`Persuasion Score: ${this.persuasionScore}`);
    this.finishButton.setVisible(true);
  }
}

