/**
 * Simultaneous playback button for multiple audio / video.
 */
export default class ButtonMediaSamePlay extends HTMLButtonElement {
	#targetElements: HTMLMediaElement[] = []; // 同時再生する要素
	#paused = true; // ボタンのステータス：一時停止中かどうか

	constructor() {
		super();

		this.type = 'button';
	}

	connectedCallback(): void {
		const targetElementIds = this.dataset.targetsFor?.split(' ');
		if (targetElementIds === undefined) {
			throw new Error('Attribute: `data-targets-for` is not set.');
		}

		for (const targetElementId of targetElementIds) {
			const targetElement = <HTMLMediaElement | null>document.getElementById(targetElementId);
			if (targetElement === null) {
				throw new Error(`Element: #${targetElementId} can not found.`);
			}

			this.#targetElements.push(targetElement);
		}

		this.addEventListener('click', this._clickEvent, { passive: true });
	}

	disconnectedCallback(): void {
		this.removeEventListener('click', this._clickEvent);
	}

	/**
	 * ボタン押下時の処理
	 */
	private _clickEvent() {
		if (this.#targetElements.every((element) => element.ended)) {
			/* すべての動画が再生終了していたら最初から再生を始める */
			for (const targetElement of this.#targetElements) {
				targetElement.currentTime = 0;
				targetElement.play();
			}

			this.#paused = false;
		} else {
			if (this.#paused) {
				/* 一時停止中だったらもっとも再生時間が低い動画に合わせて再生する */
				const minTime = this.#targetElements.reduce((accumulator, currentValue) =>
					accumulator.currentTime < currentValue.currentTime ? accumulator : currentValue
				).currentTime; // すべての動画の中でもっとも再生時間が低いもの

				for (const mediaElement of this.#targetElements) {
					mediaElement.currentTime = minTime;
					mediaElement.play();
				}
			} else {
				/* 再生中だったら一時停止する */
				for (const mediaElement of this.#targetElements) {
					mediaElement.pause();
				}
			}

			this.#paused = !this.#paused;
		}
	}
}
