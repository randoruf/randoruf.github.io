---
layout: post
title: "Double Buffering in Java - Getting Rid of Flicker and Tearing"
date: 2021-01-19T00:20:00Z
---

**Double Buffer** 

- 第一种是 Offscreen Buffer 画图，然后复制到屏幕(复制到 Screen Buffer)。 所以有两个 Buffers
- 第二种。显然复制会很浪费时间，为什么不用三个 Buffer 呢？



When you run `AnimationTest1`, you probably notice a big problem: The animated character flickers. And it's annoying. Why does this happen, and how can you get rid of it? This is happening because you're constantly drawing directly to the screen, like in [Screenshot](http://underpop.online.fr/j/java/help/getting-rid-of-flicker-and-tearing-d-graphics-and-animation-java.html#ch02fig08). That means you erase the character with the background and then redraw the character, so there are sometimes brief moments that you see the background where the character should be. Because it's happening so fast, it appears as flicker.



![When you draw directly to the screen, the user sees what you're drawing as it is being drawn.](/shared/imgs/java-game-dev-02fig08.gif)

**When you draw directly to the screen, the user sees what you're drawing as it is being drawn.**

How can you get rid of the flicker? The answer is to use double buffering.

## DOUBLE BUFFERING

A buffer is simply an off-screen area of memory used for drawing. When you use double buffering, instead of drawing directly to the screen, you draw to a back buffer and then copy the entire buffer to the screen, as shown in [Screenshot](http://underpop.online.fr/j/java/help/getting-rid-of-flicker-and-tearing-d-graphics-and-animation-java.html#ch02fig09). That way the whole screen is updated at once and players see only what they're supposed to see.



![Double buffering works by first drawing to a buffer and then copying the buffer to the screen.](/shared/imgs/java-game-dev-02fig09.gif)

**Double buffering works by first drawing to a buffer and then copying the buffer to the screen.**

The back buffer can be just a normal Java image. You can use `Component`'s `createImage(int w, int h)` method to create a back buffer. For example, if you want to double buffer an applet that isn't using active rendering, you could override the `update()` method to use a double buffer and call the `paint()` method with the double buffer's graphics context:

```java
private Image doubleBuffer;
...
public void update(Graphics g) {
 Dimension size = getSize();
 if (doubleBuffer == null ||
 doubleBuffer.getWidth(this) != size.width ||
 doubleBuffer.getHeight(this) != size.height)
 {
 doubleBuffer = createImage(size.width, size.height);
 }
 if (doubleBuffer != null) {
 // paint to double buffer
 Graphics g2 = doubleBuffer.getGraphics();
 paint(g2);
 g2.dispose();
 // copy double buffer to screen
 g.drawImage(doubleBuffer, 0, 0, null);
 }
 else {
 // couldn't create double buffer, just paint to screen
 paint(g);
 }
}
public void paint(Graphics g) {
 // do drawing here
 ...
}
```





## PAGE FLIPPING

One drawback to using double buffering is the amount of time it takes to copy the back buffer to the screen. A display resolution of 800x600 at a bit depth of 16 takes 800x600x2 bytes, or 938KB. That's nearly a megabyte of memory that has to get shuffled around at 30 frames per second. Although copying that amount of memory is fast enough for many games, what if you didn't have to copy a buffer at all and could instantly make the back buffer the display buffer? You can: This technique is called page flipping. With page flipping, you use two buffers, one as a back buffer and the other as a display buffer, as in [Screenshot](http://underpop.online.fr/j/java/help/getting-rid-of-flicker-and-tearing-d-graphics-and-animation-java.html#ch02fig10).



![The display pointer points to buffer 1, and buffer 2 is used as the back buffer.](/shared/imgs/java-game-dev-02fig10.gif)

**The display pointer points to buffer 1, and buffer 2 is used as the back buffer.**

The display pointer points to buffer being displayed. This display pointer can be changed on most modern systems. When you are finished drawing to the back buffer, the display pointer can be switched from the current display buffer to the back buffer, as in [Screenshot](http://underpop.online.fr/j/java/help/getting-rid-of-flicker-and-tearing-d-graphics-and-animation-java.html#ch02fig11). When the display pointer is changed, the display buffer instantly becomes the back buffer, and vice versa.



![After flipping the page, the display pointer points to buffer 2, and buffer 1 is used as the back buffer.](/shared/imgs/java-game-dev-02fig11.gif)

**After flipping the page, the display pointer points to buffer 2, and buffer 1 is used as the back buffer.**

Of course, changing a pointer is a lot faster than copying a huge block of memory, so this gives you a performance boost over double buffering.

## MONITOR REFRESH AND TEARING

Remember that your monitor has a refresh rate. This refresh rate is usually around 75Hz or so, which means the monitor is refreshed 75 times a second. But what happens when page flipping occurs or a buffer is copied in the middle of a monitor refresh? Yes, you guessed it: Part of the old buffer can display at the same time as part of the new buffer. This effect, similar to flickering, is called tearing (see [Screenshot](http://underpop.online.fr/j/java/help/getting-rid-of-flicker-and-tearing-d-graphics-and-animation-java.html#ch02fig12)). It happens so fast it might barely be noticeable, but when it is noticeable, it appears as tears somewhere in the screen.



![When tearing occurs, the old buffer (top) is still displayed when the new buffer (bottom) first appears. The imaginary dotted line represents the location of a tear.](/shared/imgs/java-game-dev-02fig12.gif)

**When tearing occurs, the old buffer (top) is still displayed when the new buffer (bottom) first appears. The imaginary dotted line represents the location of a tear.**

To get around this, it's possible to perform the page flip at just the right moment, right before the monitor is about to be refreshed. This might sound like a complicated task, but don't worry-the Java runtime does it all for you, using the `BufferStrategy` class.

## THE BUFFERSTRATEGY CLASS

Double buffering, page flipping, and waiting for the monitor refresh all are handled by the `BufferStrategy` class. `BufferStrategy` chooses the best buffering method based on the capabilities of the system. First, it tries page flipping. If that's not possible, it tries double buffering. Also, it waits on the monitor refresh to finish before performing any page flip. In short, it does all the work for you, without you having to think about it. One drawback to waiting for the monitor refresh is that the game is limited in the number of frames per second it can display. If the monitor is set at a 75Hz refresh rate, the game displays a maximum of 75 frames per second. This means you can't use the game's frame rate as a "benchmark" for how fast a system runs. Of course, it really doesn't matter whether your game runs at 200 frames per second-you'll still see only what your monitor is capable of. No matter how fast your game runs, you'll still see 75 frames per second on a monitor with a 75Hz refresh rate. Both the `Canvas` and `Window` objects can have a `BufferStrategy`. Use the `createBufferStrategy()` method to create a `BufferStrategy` based on the number of buffers you want. You'll want at least two buffers for double buffering and page flipping to work. For example:

```java
frame.createBufferStrategy(2);
```

After you've created the `BufferStrategy`, get a reference to it by calling the `getBufferStrategy()` method and use the `getDrawGraphics()` method to get the graphics context for the draw buffer. After you finish drawing, call the `show()` method to show the draw buffer, either by using a page flip or by copying the draw buffer to the display buffer. Here's an example:

```java
BufferStrategy strategy = frame.getBufferStrategy();
Graphics g = strategy.getDrawGraphics();
draw(g);
g.dispose();
strategy.show();
```





## CREATING A SCREEN MANAGER

Now let's update the `SimpleScreenManager` with these new features. Here are some of the things you'll add:

- Double buffering and page flipping by creating a `BufferStrategy`
- `getGraphics()`, which gets the graphics context for the display
- `update()`, which updates the display
- `getCompatibleDisplayModes()`, which gets a list of the compatible display modes
- `getCurrentDisplayMode()`, which gets the current display mode
- `findFirstCompatibleMode()`, which gets the first compatible mode from a list of modes

Also, now that you're doing active rendering, there's no need for the `JFrame` used as the full-screen window to receive `paint` events from the operating system, so you can turn them off:

```
frame.ignoreRepaint(true);
```

This doesn't turn off normal `repaint` events, however. Calling `repaint()` on the `JFrame` stills send a `paint` event. The `SimpleScreenManager` is updated in the `ScreenManager` class, shown here in [Listing 2.7](http://underpop.online.fr/j/java/help/getting-rid-of-flicker-and-tearing-d-graphics-and-animation-java.html#ch02list07).

### Listing 2.7 ScreenManager.java

```java
import java.awt.*;
import java.awt.image.BufferStrategy;
import javax.swing.JFrame;
/**
 The ScreenManager class manages initializing and displaying
 full screen graphics modes.
*/
public class ScreenManager {
 private GraphicsDevice device;
 /**
 Creates a new ScreenManager object.
 */
 public ScreenManager() {
 GraphicsEnvironment environment =
 GraphicsEnvironment.getLocalGraphicsEnvironment();
 device = environment.getDefaultScreenDevice();
 }
 /**
 Returns a list of compatible display modes for the
 default device on the system.
 */
 public DisplayMode[] getCompatibleDisplayModes() {
 return device.getDisplayModes();
 }
 /**
 Returns the first compatible mode in a list of modes.
 Returns null if no modes are compatible.
 */
 public DisplayMode findFirstCompatibleMode(
 DisplayMode modes[])
 {
 DisplayMode goodModes[] = device.getDisplayModes();
 for (int i = 0; i < modes.length; i++) {
 for (int j = 0; j < goodModes.length; j++) {
 if (displayModesMatch(modes[i], goodModes[j])) {
 return modes[i];
 }
 }
 }
 return null;
 }
 /**
 Returns the current display mode.
 */
 public DisplayMode getCurrentDisplayMode() {
 return device.getDisplayMode();
 }
 /**
 Determines if two display modes "match". Two display
 modes match if they have the same resolution, bit depth,
 and refresh rate. The bit depth is ignored if one of the
 modes has a bit depth of DisplayMode.BIT_DEPTH_MULTI.
 Likewise, the refresh rate is ignored if one of the
 modes has a refresh rate of
 DisplayMode.REFRESH_RATE_UNKNOWN.
 */
 public boolean displayModesMatch(DisplayMode mode1,
 DisplayMode mode2)
 {
 if (mode1.getWidth() != mode2.getWidth() ||
 mode1.getHeight() != mode2.getHeight())
 {
 return false;
 }
 if (mode1.getBitDepth() != DisplayMode.BIT_DEPTH_MULTI &&
 mode2.getBitDepth() != DisplayMode.BIT_DEPTH_MULTI &&
 mode1.getBitDepth() != mode2.getBitDepth())
 {
 return false;
 }
 if (mode1.getRefreshRate() !=
 DisplayMode.REFRESH_RATE_UNKNOWN &&
 mode2.getRefreshRate() !=
 DisplayMode.REFRESH_RATE_UNKNOWN &&
 mode1.getRefreshRate() != mode2.getRefreshRate())
 {
 return false;
 }
 return true;
 }
/**
 Enters full screen mode and changes the display mode.
 If the specified display mode is null or not compatible
 with this device, or if the display mode cannot be
 changed on this system, the current display mode is used.
 <p>
 The display uses a BufferStrategy with 2 buffers.
 */
 public void setFullScreen(DisplayMode displayMode) {
 JFrame frame = new JFrame();
 frame.setUndecorated(true);
 frame.setIgnoreRepaint(true);
 frame.setResizable(false);
 device.setFullScreenWindow(frame);
 if (displayMode != null &&
 device.isDisplayChangeSupported())
 {
 try {
 device.setDisplayMode(displayMode);
 }
 catch (IllegalArgumentException ex) { }
 }
 frame.createBufferStrategy(2);
 }
 /**
 Gets the graphics context for the display. The
 ScreenManager uses double buffering, so apps must
 call update() to show any graphics drawn.
 <p>
 The app must dispose of the graphics object.
 */
 public Graphics2D getGraphics() {
 Window window = device.getFullScreenWindow();
 if (window != null) {
 BufferStrategy strategy = window.getBufferStrategy();
 return (Graphics2D)strategy.getDrawGraphics();
 }
 else {
 return null;
 }
 }
 /**
 Updates the display.
 */
 public void update() {
 Window window = device.getFullScreenWindow();
 if (window != null) {
 BufferStrategy strategy = window.getBufferStrategy();
 if (!strategy.contentsLost()) {
 strategy.show();
 }
 }
 // Sync the display on some systems.
 // (on Linux, this fixes event queue problems)
 Toolkit.getDefaultToolkit().sync();
 }
 /**
 Returns the window currently used in full screen mode.
 Returns null if the device is not in full screen mode.
 */
 public Window getFullScreenWindow() {
 return device.getFullScreenWindow();
 }
 /**
 Returns the width of the window currently used in full
 screen mode. Returns 0 if the device is not in full
 screen mode.
 */
 public int getWidth() {
 Window window = device.getFullScreenWindow();
 if (window != null) {
 return window.getWidth();
 }
 else {
 return 0;
 }
 }
 /**
 Returns the height of the window currently used in full
 screen mode. Returns 0 if the device is not in full
 screen mode.
 */
 public int getHeight() {
 Window window = device.getFullScreenWindow();
 if (window != null) {
 return window.getHeight();
 }
 else {
 return 0;
 }
 }
 /**
 Restores the screen's display mode.
 */
 public void restoreScreen() {
 Window window = device.getFullScreenWindow();
 if (window != null) {
 window.dispose();
 }
 device.setFullScreenWindow(null);
 }
 /**
 Creates an image compatible with the current display.
 */
 public BufferedImage createCompatibleImage(int w, int h,
 int transparency)
 {
 Window window = device.getFullScreenWindow();
 if (window != null) {
 GraphicsConfiguration gc =
 window.getGraphicsConfiguration();
 return gc.createCompatibleImage(w, h, transparency);
 }
 return null;
 }
}
```

In `ScreenManager`, you'll notice the following line in the `update()` method:

```
Toolkit.getDefaultToolkit().sync();
```

This method makes sure the display is synchronized with the window system. On many systems, this method does nothing, but on Linux, calling this method fixes problems with the AWT event queue. Without calling this method, some Linux systems might experience delayed mouse and keyboard input events. Two new `ScreenManager` methods to note are `displayModesMatch()` and `createCompatibleImage()`. The `displayModesMatch()` method checks whether two `DisplayMode` objects "match." They match if the resolution, bit depth, and refresh rate are equal. The bit depth and the refresh rate are ignored if they aren't specified in one of the `DisplayMode` objects. `createCompatibleImage()` creates an image that is compatible with the display-that is, the image would have the same bit depth and color model as the display. The image class created is a `BufferedImage`, which is a nonaccelerated image stored in system memory. This method is useful for creating transparent or translucent images because the normal `createImage()` method creates only opaque images. Now you'll update `AnimationTest1` to use the new and improved `ScreenManager`, creating the `AnimationTest2` class in [Listing 2.8](http://underpop.online.fr/j/java/help/getting-rid-of-flicker-and-tearing-d-graphics-and-animation-java.html#ch02list08). Hooray, no more flickering!

### Listing 2.8 AnimationTest2.java

```java
import java.awt.*;
import javax.swing.ImageIcon;
public class AnimationTest2 {
 public static void main(String args[]) {
 AnimationTest2 test = new AnimationTest2();
 test.run();
 }
 private static final DisplayMode POSSIBLE_MODES[] = {
 new DisplayMode(800, 600, 32, 0),
 new DisplayMode(800, 600, 24, 0),
 new DisplayMode(800, 600, 16, 0),
 new DisplayMode(640, 480, 32, 0),
 new DisplayMode(640, 480, 24, 0),
 new DisplayMode(640, 480, 16, 0)
 };
 private static final long DEMO_TIME = 10000;
 private ScreenManager screen;
 private Image bgImage;
 private Animation anim;
 public void loadImages() {
 // load images
 bgImage = loadImage("images/background.jpg");
 Image player1 = loadImage("images/player1.png");
 Image player2 = loadImage("images/player2.png");
 Image player3 = loadImage("images/player3.png");
 // create animation
 anim = new Animation();
 anim.addFrame(player1, 250);
 anim.addFrame(player2, 150);
 anim.addFrame(player1, 150);
 anim.addFrame(player2, 150);
 anim.addFrame(player3, 200);
 anim.addFrame(player2, 150);
 }
 private Image loadImage(String fileName) {
 return new ImageIcon(fileName).getImage();
 }
 public void run() {
 screen = new ScreenManager();
 try {
 DisplayMode displayMode =
 screen.findFirstCompatibleMode(POSSIBLE_MODES);
 screen.setFullScreen(displayMode);
 loadImages();
 animationLoop();
 }
 finally {
 screen.restoreScreen();
 }
 }
 public void animationLoop() {
 long startTime = System.currentTimeMillis();
 long currTime = startTime;
 while (currTime - startTime < DEMO_TIME) {
 long elapsedTime =
 System.currentTimeMillis() - currTime;
 currTime += elapsedTime;
 // update animation
 anim.update(elapsedTime);
 // draw and update screen
 Graphics2D g = screen.getGraphics();
 draw(g);
 g.dispose();
 screen.update();
 // take a nap
 try {
 Thread.sleep(20);
 }
 catch (InterruptedException ex) { }
 }
 }
 public void draw(Graphics g) {
 // draw background
 g.drawImage(bgImage, 0, 0, null);
 // draw image
 g.drawImage(anim.getImage(), 0, 0, null);
 }
}
```

Not much has changed in the move from `AnimationTest1` to `AnimationTest2`. One thing that has changed is how `AnimationTest2` selects a display mode. Instead of using a default display mode or getting the display mode from the command line, `AnimationTest2` provides the `ScreenManager` with a list of possible modes to use, and the `ScreenManager` selects the first compatible mode in the list. Also, the `ScreenManager` creates its own `JFrame` object, so `AnimationTest2` doesn't have to deal with creating the `JFrame` used as the full-screen window.

## SPRITES

The animation is now running smoothly, but it's not that exciting to see something animate in one place on the screen. Let's make it move by creating a sprite. A sprite is a graphic that moves independently around the screen. In this case, the sprite is also animated, so it can animate and move at the same time. Besides an animation, the sprites will be composed of two things: a position and a velocity. If you were sleeping the day they told you about velocity in school, a velocity is both a speed (such as 55mph) and a direction (such as north). In this case, we'll break down velocity into horizontal and vertical components. Instead of miles per hour or meters per second, we'll use pixels per millisecond. You might be asking, "Why use velocity? Why not just update the sprite's position a certain amount each frame?" Well, if you did that, the sprite would move at different speeds depending on the speed of the machine. A faster frame rate would mean a faster-moving sprite. Tying the sprite's movement to real time causes the sprite to move at a consistent pace, whether the time between frames is short or long. As with the animation, the sprite updates based on the number of milliseconds that have passed since the last time the sprite was drawn. You'll say, "Hey, sprite, 50 milliseconds have passed," and the sprite will update its position (based on its velocity) and its animation. The `Sprite` class, in [Listing 2.9](http://underpop.online.fr/j/java/help/getting-rid-of-flicker-and-tearing-d-graphics-and-animation-java.html#ch02list09), has an animation, a position, and a velocity. You could make the sprite's position an integer, but what if a sprite is moving slowly? For example, imagine a sprite moving a tenth of a pixel every time the `update()` method is called. That means the sprite would have nonvisible movement on 9 out of 10 calls to `update()`. If the sprite's position were an integer, the sprite would never move because the result would be rounded each time. If the sprite's position is a floating-point value, the sprite position could increment these nonvisible movements, and the sprite would move 1 pixel on every tenth call to `update()`, as expected. For this reason, you'll make the sprites' position a floating-point value. To get its exact pixel position, use `Math.round()`.

### Listing 2.9 Sprite.java

```java
import java.awt.Image;
public class Sprite {
 private Animation anim;
 // position (pixels)
 private float x;
 private float y;
 // velocity (pixels per millisecond)
 private float dx;
 private float dy;
 /**
 Creates a new Sprite object with the specified Animation.
 */
 public Sprite(Animation anim) {
 this.anim = anim;
 }
 /**
 Updates this Sprite's Animation and its position based
 on the velocity.
 */
 public void update(long elapsedTime) {
 x += dx * elapsedTime;
 y += dy * elapsedTime;
 anim.update(elapsedTime);
 }
 /**
 Gets this Sprite's current x position.
 */
 public float getX() {
 return x;
 }
 /**
 Gets this Sprite's current y position.
 */
 public float getY() {
 return y;
 }
 /**
 Sets this Sprite's current x position.
 */
 public void setX(float x) {
 this.x = x;
 }
 /**
 Sets this Sprite's current y position.
 */
 public void setY(float y) {
 this.y = y;
 }
 /**
 Gets this Sprite's width, based on the size of the
 current image.
 */
 public int getWidth() {
 return anim.getImage().getWidth(null);
 }
 /**
 Gets this Sprite's height, based on the size of the
 current image.
 */
 public int getHeight() {
 return anim.getImage().getHeight(null);
 }
 /**
 Gets the horizontal velocity of this Sprite in pixels
 per millisecond.
 */
 public float getVelocityX() {
 return dx;
 }
 /**
 Gets the vertical velocity of this Sprite in pixels
 per millisecond.
 */
 public float getVelocityY() {
 return dy;
 }
 /**
 Sets the horizontal velocity of this Sprite in pixels
 per millisecond.
 */
 public void setVelocityX(float dx) {
 this.dx = dx;
 }
 /**
 Sets the vertical velocity of this Sprite in pixels
 per millisecond.
 */
 public void setVelocityY(float dy) {
 this.dy = dy;
 }
 /**
 Gets this Sprite's current image.
 */
 public Image getImage() {
 return anim.getImage();
 }
}
```

The `Sprite` class is fairly simple. Mostly it's a just bunch of `get` and `set` methods. All the work is done in the `update()` method, which updates the sprite's position based on its velocity and the amount of time elapsed. Now let's have some fun. Let's use the `Sprite` class to make the character animate and bounce around the screen. `SpriteTest1`, in [Listing 2.10](http://underpop.online.fr/j/java/help/getting-rid-of-flicker-and-tearing-d-graphics-and-animation-java.html#ch02list10), does just that. Every time the sprite hits the edge of the screen, its velocity is changed to reflect the bounce.

### Listing 2.10 SpriteTest1.java

```java
import java.awt.*;
import javax.swing.ImageIcon;
public class SpriteTest1 {
 public static void main(String args[]) {
 SpriteTest1 test = new SpriteTest1();
 test.run();
 }
 private static final DisplayMode POSSIBLE_MODES[] = {
 new DisplayMode(800, 600, 32, 0),
 new DisplayMode(800, 600, 24, 0),
 new DisplayMode(800, 600, 16, 0),
 new DisplayMode(640, 480, 32, 0),
 new DisplayMode(640, 480, 24, 0),
 new DisplayMode(640, 480, 16, 0)
 };
 private static final long DEMO_TIME = 10000;
 private ScreenManager screen;
 private Image bgImage;
 private Sprite sprite;
 public void loadImages() {
 // load images
 bgImage = loadImage("images/background.jpg");
 Image player1 = loadImage("images/player1.png");
 Image player2 = loadImage("images/player2.png");
 Image player3 = loadImage("images/player3.png");
 // create sprite
 Animation anim = new Animation();
 anim.addFrame(player1, 250);
 anim.addFrame(player2, 150);
 anim.addFrame(player1, 150);
 anim.addFrame(player2, 150);
 anim.addFrame(player3, 200);
 anim.addFrame(player2, 150);
 sprite = new Sprite(anim);
 // start the sprite off moving down and to the right
 sprite.setVelocityX(0.2f);
 sprite.setVelocityY(0.2f);
 }
 private Image loadImage(String fileName) {
 return new ImageIcon(fileName).getImage();
 }
 public void run() {
 screen = new ScreenManager();
 try {
 DisplayMode displayMode =
 screen.findFirstCompatibleMode(POSSIBLE_MODES);
 screen.setFullScreen(displayMode);
 loadImages();
 animationLoop();
 }
 finally {
 screen.restoreScreen();
 }
 }
 public void animationLoop() {
 long startTime = System.currentTimeMillis();
 long currTime = startTime;
 while (currTime - startTime < DEMO_TIME) {
 long elapsedTime =
 System.currentTimeMillis() - currTime;
 currTime += elapsedTime;
 // update the sprites
 update(elapsedTime);
 // draw and update the screen
 Graphics2D g = screen.getGraphics();
 draw(g);
 g.dispose();
 screen.update();
 // take a nap
 try {
 Thread.sleep(20);
 }
 catch (InterruptedException ex) { }
 }
 }
 public void update(long elapsedTime) {
 // check sprite bounds
 if (sprite.getX() < 0) {
 sprite.setVelocityX(Math.abs(sprite.getVelocityX()));
 }
 else if (sprite.getX() + sprite.getWidth() >=
 screen.getWidth())
 {
 sprite.setVelocityX(-Math.abs(sprite.getVelocityX()));
 }
 if (sprite.getY() < 0) {
 sprite.setVelocityY(Math.abs(sprite.getVelocityY()));
 }
 else if (sprite.getY() + sprite.getHeight() >=
 screen.getHeight())
 {
 sprite.setVelocityY(-Math.abs(sprite.getVelocityY()));
 }
 // update sprite
 sprite.update(elapsedTime);
 }
 public void draw(Graphics g) {
 // draw background
 g.drawImage(bgImage, 0, 0, null);
 // draw sprite
 g.drawImage(sprite.getImage(),
 Math.round(sprite.getX()),
 Math.round(sprite.getY()),
 null);
 }
}
```

Because the `Sprite` object handles its own movement, there's not much new happening in the `SpriteTest1` class. The newest thing is the `update()` method, which causes the sprite to "bounce" when it hits the edge of the screen. If the sprite hits the left or right edge of the screen, the horizontal velocity is reversed. If the sprite hits the top or bottom edge of the screen, the vertical velocity is reversed.