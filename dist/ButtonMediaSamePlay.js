var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _targetElements, _paused;
/**
 * Simultaneous playback button for multiple audio / video.
 *
 * @version 1.0.0
 */
export default class ButtonMediaSamePlay extends HTMLButtonElement {
    constructor() {
        super();
        _targetElements.set(this, []); // 同時再生する要素
        _paused.set(this, true); // ボタンのステータス：一時停止中かどうか
        this.type = 'button';
    }
    connectedCallback() {
        const targetElementIds = this.dataset.targetsFor?.split(' ');
        if (targetElementIds === undefined) {
            throw new Error('Attribute: `data-targets-for` is not set.');
        }
        for (const targetElementId of targetElementIds) {
            const targetElement = document.getElementById(targetElementId);
            if (targetElement === null) {
                throw new Error(`Element: #${targetElementId} can not found.`);
            }
            __classPrivateFieldGet(this, _targetElements).push(targetElement);
        }
        this.addEventListener('click', this._clickEvent, { passive: true });
    }
    disconnectedCallback() {
        this.removeEventListener('click', this._clickEvent);
    }
    /**
     * ボタン押下時の処理
     */
    _clickEvent() {
        if (__classPrivateFieldGet(this, _targetElements).every((element) => element.ended)) {
            /* すべての動画が再生終了していたら最初から再生を始める */
            for (const targetElement of __classPrivateFieldGet(this, _targetElements)) {
                targetElement.currentTime = 0;
                targetElement.play();
            }
            __classPrivateFieldSet(this, _paused, false);
        }
        else {
            if (__classPrivateFieldGet(this, _paused)) {
                /* 一時停止中だったらもっとも再生時間が低い動画に合わせて再生する */
                const minTime = __classPrivateFieldGet(this, _targetElements).reduce((accumulator, currentValue) => accumulator.currentTime < currentValue.currentTime ? accumulator : currentValue).currentTime; // すべての動画の中でもっとも再生時間が低いもの
                for (const mediaElement of __classPrivateFieldGet(this, _targetElements)) {
                    mediaElement.currentTime = minTime;
                    mediaElement.play();
                }
            }
            else {
                /* 再生中だったら一時停止する */
                for (const mediaElement of __classPrivateFieldGet(this, _targetElements)) {
                    mediaElement.pause();
                }
            }
            __classPrivateFieldSet(this, _paused, !__classPrivateFieldGet(this, _paused));
        }
    }
}
_targetElements = new WeakMap(), _paused = new WeakMap();
//# sourceMappingURL=ButtonMediaSamePlay.js.map