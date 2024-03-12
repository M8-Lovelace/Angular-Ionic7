import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationController, GestureController, IonicModule, Platform, Animation, GestureDetail } from '@ionic/angular';
import { AdMob, BannerAdPluginEvents, AdMobBannerSize, BannerAdOptions, BannerAdSize, BannerAdPosition, AdmobConsentStatus } from '@capacitor-community/admob';
import { Cell } from '../models/cell';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertService } from '../services/alert.service';
import { Share, ShareOptions } from '@capacitor/share';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    TranslateModule
  ]
})
export class GamePage implements AfterViewInit {

  // Viewchild del tablero
  @ViewChild('boardGame', { read: ElementRef }) boardGame: ElementRef;
  // Matriz donde guardaremos las celdas
  public board: Cell[][];

  // filas y columnas
  public rows: number[];
  public cols: number[];

  // Direccion en la que nos movemos
  private direction: number;

  private DIRECTION_UP = 0;
  private DIRECTION_DOWN = 1;
  private DIRECTION_LEFT = 2;
  private DIRECTION_RIGHT = 3;

  // Indica si ha habido movimiento
  private hasMovement: boolean;

  // Puntos
  public points: number;
  private pointsRound: number;

  // Animaciones
  private animations: Animation[];

  // Indica si se esta moviendo
  private isMoving: boolean;

  constructor(
    private gestureController: GestureController,
    private alertService: AlertService,
    private translate: TranslateService,
    private animationsController: AnimationController,
    private platform: Platform
  ) {
    // Numero de filas y columnas
    this.rows = Array(4).fill(0);
    this.cols = Array(4).fill(0);
    this.animations = [];
    this.newGame();
    this.banner();
  }

  ngAfterViewInit(): void {

    // Gesto horizontal
    const hSwipe = this.gestureController.create({
      el: this.boardGame.nativeElement,
      gestureName: 'hswipe',
      maxAngle: 30,
      direction: 'x',
      onEnd: (detail) => this.onHSwipe(detail)
    }, true)

    // Gesto vertical
    const vSwipe = this.gestureController.create({
      el: this.boardGame.nativeElement,
      gestureName: 'vswipe',
      maxAngle: 30,
      direction: 'y',
      onEnd: (detail) => this.onVSwipe(detail)
    }, true)

    // Habilitamos los gestos
    // Primero vertical y luego horizontal
    vSwipe.enable();
    hSwipe.enable();

  }

  onHSwipe(detail: GestureDetail) {

    // No hacemos otro movimiento hasta que no deje de moverse las celdas
    if (!this.isMoving) {

      // Indicamos que se esta moviendo
      this.isMoving = true;

      console.log("Horizontal");
      console.log(detail);

      if (detail.deltaX < 0) {
        console.log("Izquierda");
        this.direction = this.DIRECTION_LEFT;
        this.moveLeft();
      } else {
        console.log("Derecha");
        this.direction = this.DIRECTION_RIGHT;
        this.moveRight();
      }

      // Chequeamos el movimiento
      this.checkMove();
    }


  }

  onVSwipe(detail: GestureDetail) {

    // No hacemos otro movimiento hasta que no deje de moverse las celdas
    if (!this.isMoving) {

      // Indicamos que se esta moviendo
      this.isMoving = true;

      console.log("Vertical");
      console.log(detail);

      if (detail.deltaY < 0) {
        console.log("Arriba");
        this.direction = this.DIRECTION_UP;
        this.moveUp();
      } else {
        console.log("Abajo");
        this.direction = this.DIRECTION_DOWN;
        this.moveDown();
      }

      // Chequeamos el movimiento
      this.checkMove();
    }

  }

  generateRandonNumber() {

    let row = 0;
    let col = 0;

    // Obtenemos una fila y columna aleatoria
    // Terminamos cuando hay una celda vacia
    do {
      row = Math.floor(Math.random() * this.board.length);
      col = Math.floor(Math.random() * this.board[0].length);
    } while (this.board[row][col] != null);

    // Creamos una celda
    this.board[row][col] = new Cell();

    // 25% de que salga un 4
    const probNum4 = Math.floor(Math.random() * 100) + 1;

    let background;
    if (probNum4 <= 25) {
      this.board[row][col].value = 4;
      background = '#eee1c9';
    } else {
      this.board[row][col].value = 2;
      background = '#eee4da';
    }

    // Creamos la animacion
    const animation = this.animationsController.create()
      .addElement(document.getElementById(row + '' + col))
      .duration(500)
      .fromTo('background', 'rgba(238, 228, 218, .35)', background);

    // Activamos la animacion
    animation.play();

    // Paramos la animacion
    setTimeout(() => {
      animation.stop();
    }, 500);

  }

  moveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 1; j < this.board[i].length; j++) {
        this.processPosition(i, j);
      }
    }
  }

  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = this.board[i].length - 2; j >= 0; j--) {
        this.processPosition(i, j);
      }
    }
  }

  moveUp() {
    for (let i = 1; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.processPosition(i, j);
      }
    }
  }

  moveDown() {
    for (let i = this.board.length - 2; i >= 0; i--) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.processPosition(i, j);
      }
    }
  }

  nextPositionFree(rowOri: number, colOri: number, numberOriginal: number) {

    let rowNew: number;
    let colNew: number;
    let found: boolean;

    switch (this.direction) {
      case this.DIRECTION_LEFT:
        // La fila es la misma
        rowNew = rowOri;
        // Empezamos desde la celda de la izquierda
        for (let j = colOri - 1; j >= 0 && !found; j--) {
          // Buscamos la primera celda
          if (this.board[rowOri][j] != null) {
            found = true;

            // Si esta bloqueada la celda, nos quedamos al lado de ella
            if (this.board[rowOri][j].blocked) {
              colNew = j + 1;
              // Si coincide el valor, nos quedamos en la misma celda
            } else if (this.board[rowOri][j].value == numberOriginal) {
              colNew = j;
              // Sino se cumple lo anterior y es diferente de la original, nos quedamos al lado
            } else if ((j + 1) != colOri) {
              colNew = j + 1;
            }


          }

        }

        // Sino lo encontramos, nos quedamos al principio de la fila
        if (!found) {
          colNew = 0;
        }

        break;
      case this.DIRECTION_RIGHT:
        // La fila es la misma
        rowNew = rowOri;
        for (let j = colOri + 1; j < this.board[rowOri].length && !found; j++) {
          // Buscamos la primera celda
          if (this.board[rowOri][j] != null) {
            found = true;

            // Si esta bloqueada la celda, nos quedamos al lado de ella
            if (this.board[rowOri][j].blocked) {
              colNew = j - 1;
              // Si coincide el valor, nos quedamos en la misma celda
            } else if (this.board[rowOri][j].value == numberOriginal) {
              colNew = j;
              // Sino se cumple lo anterior y es diferente de la original, nos quedamos al lado
            } else if ((j - 1) != colOri) {
              colNew = j - 1;
            }

          }

        }

        // Sino lo encontramos, nos quedamos al final de la fila
        if (!found) {
          colNew = this.board[rowOri].length - 1;
        }


        break;
      case this.DIRECTION_UP:
        // La columna es la misma
        colNew = colOri;
        for (let i = rowOri - 1; i >= 0 && !found; i--) {
          // Buscamos la primera celda
          if (this.board[i][colOri] != null) {
            found = true;

            // Si esta bloqueada la celda, nos quedamos al lado de ella
            if (this.board[i][colOri].blocked) {
              rowNew = i + 1;
              // Si coincide el valor, nos quedamos en la misma celda
            } else if (this.board[i][colOri].value == numberOriginal) {
              rowNew = i;
              // Sino se cumple lo anterior y es diferente de la original, nos quedamos al lado
            } else if ((i + 1) != rowOri) {
              rowNew = i + 1;
            }

          }

        }

        // Sino lo encontramos, nos quedamos al principio de la columna
        if (!found) {
          rowNew = 0
        }

        break;
      case this.DIRECTION_DOWN:
        // La columna es la misma
        colNew = colOri;
        for (let i = rowOri + 1; i < this.board.length && !found; i++) {
          // Buscamos la primera celda
          if (this.board[i][colOri] != null) {
            found = true;

            // Si esta bloqueada la celda, nos quedamos al lado de ella
            if (this.board[i][colOri].blocked) {
              rowNew = i - 1;
              // Si coincide el valor, nos quedamos en la misma celda
            } else if (this.board[i][colOri].value == numberOriginal) {
              rowNew = i;
              // Sino se cumple lo anterior y es diferente de la original, nos quedamos al lado
            } else if ((i - 1) != rowOri) {
              rowNew = i - 1;
            }

          }

        }

        // Sino lo encontramos, nos quedamos al final de la columna
        if (!found) {
          rowNew = this.board.length - 1;
        }

        break;
    }

    console.log("rowNew: " + rowNew);
    console.log("colNew: " + colNew);

    // Si se han rellenado las variables
    // Devolvemos un array con la posicion libre
    if (rowNew !== undefined && colNew !== undefined) {
      return [rowNew, colNew];
    }

    return null;

  }

  processPosition(i: number, j: number) {
    const cell = this.board[i][j];
    if (cell != null) {
      // Obtenemos la posicion libre
      const nextPosition = this.nextPositionFree(i, j, cell.value);

      // Si hay una posicion libre
      if (nextPosition) {

        const row = nextPosition[0];
        const col = nextPosition[1];

        // Si esta vacio, creamos una celda
        if (!this.board[row][col]) {
          this.board[row][col] = new Cell();
        }

        // Si las celdas tienen el mismo valor, se fusionan
        if (cell.value == this.board[row][col].value) {
          const points = cell.value * 2;
          this.board[row][col].value = points;
          this.board[row][col].blocked = true;
          // Aumentamos los puntos
          this.points += points;
          this.pointsRound += points;
        } else {
          // Colocamos la celda en la nueva posicion
          this.board[row][col] = cell;
        }

        // Limpiamos la celda original
        this.board[i][j] = null;

        // Indicamos que ha habido movimiento
        this.hasMovement = true;

        // Obtenemos el numero de celdas para la animacion (puede ser negativo)
        let numberCells;
        switch (this.direction) {
          case this.DIRECTION_LEFT:
          case this.DIRECTION_RIGHT:
            numberCells = col - j;
            break;
          case this.DIRECTION_UP:
          case this.DIRECTION_DOWN:
            numberCells = row - i;
            break;
        }

        // Preparamos el movimiento de la animacion
        this.showAnimationMove(i, j, numberCells);

      }
    }
  }

  clearBlockedCells() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        // Si existe la celda, la desbloqueamos
        if (this.board[i][j] != null) {
          this.board[i][j].blocked = false;
        }
      }
    }
  }

  checkMove() {

    // Si ganamos, mostramos un mensaje
    if (this.winGame()) {
      this.alertService.alertCustomButtons(
        this.translate.instant('label.win.game.title'),
        this.translate.instant('label.game.content', { "points": this.points }),
        [
          {
            text: this.translate.instant('label.new.game'),
            handler: () => {
              this.newGame();
            }
          },
          {
            text: this.translate.instant('label.share'),
            handler: () => {
              this.sharePuntuation();
              this.newGame();
            }
          }
        ],
        false
      )
      // Si perdemos, mostramos un mensaje
    } else if (this.loseGame()) {
      this.alertService.alertCustomButtons(
        this.translate.instant('label.lose.game.title'),
        this.translate.instant('label.game.content', { "points": this.points }),
        [
          {
            text: this.translate.instant('label.new.game'),
            handler: () => {
              this.newGame();
            }
          },
          {
            text: this.translate.instant('label.share'),
            handler: () => {
              this.sharePuntuation();
              this.newGame();
            }
          }
        ],
        false
      )
    } else if (this.hasMovement) {

      // generamos un nuevo numero
      this.generateRandonNumber();

      // Reiniciamos la variable
      this.hasMovement = false;

      // Si ha habido puntos, mostramos la animacion y reinciamos
      if (this.pointsRound > 0) {
        this.showAnimationPoints();
        this.pointsRound = 0;
      }

      // Creamos las animaciones agrupadas
      const animationGrouped = this.animationsController.create()
        .addAnimation(this.animations)
        .duration(100);

      // Activamos todas las animaciones
      animationGrouped.play();

      // Paramos la animacion y reiniciamos las animaciones
      setTimeout(() => {
        animationGrouped.stop();
        this.animations = [];
      }, 100);

      // indicamos en 600ms que ya no nos estamos movimiento
      setTimeout(() => {
        this.isMoving = false;
      }, 600);

      // limpiamos las celdas
      this.clearBlockedCells();
    } else {
      // indicamos que no nos estamos movimiento
      this.isMoving = false;
    }

  }

  /*
   *  Ganamos cuando encontramos un 2048 
   */
  winGame() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] != null && this.board[i][j].value == 2048) {
          return true;
        }
      }
    }
    return false;
  }

  /*
   *  Perdemos cuando se cumple las dos siguientes condiciones:
   *    - El tablero esta lleno
   *    - No hay movimientos posibles
   */
  loseGame() {

    // Comprobar si esta lleno
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] == null) {
          return false;
        }
      }
    }

    // Comprobamos si hay movimientos posibles
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (
          (this.board[i - 1] && this.board[i - 1][j].value == this.board[i][j].value) ||
          (this.board[i][j + 1] && this.board[i][j + 1].value == this.board[i][j].value) ||
          (this.board[i + 1] && this.board[i + 1][j].value == this.board[i][j].value) ||
          (this.board[i][j - 1] && this.board[i][j - 1].value == this.board[i][j].value)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  newGame() {
    // Tablero vacio
    this.board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ];
    // Generamos dos numeros aleatorios
    this.generateRandonNumber();
    this.generateRandonNumber();
    this.points = 0;
    this.pointsRound = 0;
    this.hasMovement = false;
    this.isMoving = false;
  }

  showAnimationPoints() {

    // Obtenemos el elemento con el id pointsScored
    const elementPoints = document.getElementById('pointsScored');

    // Colocamos el texto con los puntos
    elementPoints.innerHTML = '+' + this.pointsRound;

    // Creamos la animacion
    const animation = this.animationsController.create()
      .addElement(elementPoints)
      .duration(1000)
      .fromTo('transform', 'translateY(0px)', 'translateY(-60px)')
      .fromTo('opacity', 0, 1);

    // Activamos la animacion
    animation.play();

    // Paramos la animacion y limpiamos el texto
    setTimeout(() => {
      animation.stop();
      elementPoints.innerHTML = '';
    }, 1000);

  }

  showAnimationMove(row: number, col: number, numberCells: number) {

    // Creamos la animacion con el elemento con su fila y columna
    let animation = this.animationsController.create()
      .addElement(document.getElementById(row + '' + col));

    // Segun si es horizontal o vertical, nos movemos x px
    switch (this.direction) {
      case this.DIRECTION_RIGHT:
      case this.DIRECTION_LEFT:
        animation = animation.fromTo('transform', 'translateX(0px)', `translateX(${numberCells * 60}px)`)
        break;
      case this.DIRECTION_UP:
      case this.DIRECTION_DOWN:
        animation = animation.fromTo('transform', 'translateY(0px)', `translateY(${numberCells * 60}px)`)
        break;
    }

    // Añadimos la animacion al array de animaciones agrupadas
    this.animations.push(animation);

  }

  async sharePuntuation() {

    // Creamos las opciones del Share
    const shareOptions: ShareOptions = {
      title: '2048',
      text: this.translate.instant('label.share.dialog.title', { points: this.points }),
      dialogTitle: this.translate.instant('label.share.dialog.title', { points: this.points })
    }

    // Segun el tipo, cambiamos la url
    if (this.platform.is('android')) {
      shareOptions.url = 'https://play.google.com/';
    } else if (this.platform.is('ios')) {
      shareOptions.url = 'http://apple.com/es/app-store';
    }

    // Mostramos el share
    await Share.share(shareOptions);

  }

  async banner() {

    // Obtenemos el valor de statusBanner
    const statusBanner = await Preferences.get({ key: 'statusBanner' });

    // Si hay consentimiento, mostramos el banner
    if (statusBanner.value == AdmobConsentStatus.OBTAINED) {

      AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        // Subscribe Banner Event Listener
        console.log("Cargado los anuncios");
      });

      AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
        // Subscribe Change Banner Size
        console.log("Anuncio redimensionado: ", size);
      });

      // Segun la plataforma, rellenamos las opciones de una forma u otra
      let options: BannerAdOptions;
      if (this.platform.is('android')) {
        options = {
          adId: 'ca-app-pub-4695431720501222/2084606895',
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: true
        };
      } else if (this.platform.is('ios')) {
        options = {
          adId: 'ca-app-pub-4695431720501222/6182390737',
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: true
        };
      }

      // Mostramos el banner
      AdMob.showBanner(options);

    }

  }
}
