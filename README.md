# stroopy-bird
Flappy Bird meets the Stroop effect.

Stroopy Bird is a challenging and addictive game which combines both the popular [Flappy Bird](https://en.wikipedia.org/wiki/Flappy_Bird) and the [Stroop effect](https://en.wikipedia.org/wiki/Stroop_effect).

Using the mouse or the space bar to jump, the player must traverse through the appropriate colour depending on the "mode" highlighted at the top of the screen.

If the mode is "Word" the player must go through the colour that the word describes. If the mode is "Colour", the player must go through the colour that matches the font colour of the word.

This sounds confusing but the game is fairly intuitive after you play it for a few rounds.

### Bugs 🐛

- Playing on a monitor with a high frequency refresh rate makes the game much trickier as the game loop is determined by the [browser's refresh rate](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

### Future ideas 💡

- Add an instructions page or pop-up
- Implement a local highscore system (browser localStorage?)
- Add a third "mode" (e.g. Word, Colour and Ball)
