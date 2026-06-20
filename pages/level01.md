# 01 - Data

At the core, a computer is a glorified calculator. It manipulates numbers. This
means that whether we browse videos online, listen for music, or play a
multiplayer game, all we see is built off numbers.

Building a robust understanding of this simple idea will be useful as we explore
and "rebuild" C++ from its most elementary pieces.

```trivia: Principle
Excellence in (pretty much) any domain is better demonstrated by a deep mastery
of its basics, rather than a catalog of its most obscure subtleties. 
```

```rec: Example
In this level we will use the number `163` for our examples.

How many ways can we find to look at it? We will consider at least 6 different
interpretation for it in this page.
```

## Byte

In base 10 (decimal), where each of the digit used to write a number can take
one of 10 values (0..9), a 3-digit number can express 1000 different values:
from 0 to 999.

Similarly, in base 2 (binary), where each of the digit used to write a number
can take only one of 2 values (0, 1), a **Byte** is an 8-digit number which can
express 256 different values: from 0 to 255.

```ref
We won't go in details over the binary representation of numbers for now as it
is not required for our current purpose. If you wish to investigate the subject,
there are many good resources on the subject.
- [Khan Academy](https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:digital-information/xcae6f4a7ff015e7d:binary-numbers/a/bits-and-binary)
- [Practical Networking Youtube](https://www.youtube.com/watch?v=RrJXLdv1i74)
```

```rec: Example
Our number `163` is within the [0..255] range of values, so it can be
represented by a Byte.
```

### Bytes as characters

Since 1961, we have been using a standard called <a
href="https://en.wikipedia.org/wiki/ASCII" target="_blank"
rel="noopener">ASCII</a> which matches numbers between 0 and 255 to specific
characters.

```rec: Example
According to this convention, the number `163` represents the
character `'£'`.
```

It is worth noting that the character `'1'` in the ASCII standard is encoded by
the number `49`. Although this number can seem arbitrary when expressed in
decimal, it makes more sense for those familiar with its binary representation
(32 + 16 + 1).

ASCII is a very common way of interpreting numbers as (latin) characters, but by
no means the only one.

### Bytes as true/false, on/off, yes/no values

Such value pairs are called Boolean values (from <a
href="https://en.wikipedia.org/wiki/George_Boole" target="_blank"
rel="noopener">George Boole</a>), and are extremely common as they represent the
simplest switch between two states, such as the dark/light theme switch in the
upper-right corner of this page, the ever-present tickbox, or a "yes/no" answer.

Although only one binary digit (0, 1) would be sufficient to encode this
information, in C++ a full Byte (8 binary digits) are used for the boolean
representation. The reasons for this will be explained much later in this
series, but for now, a hand-wavy explanation would be that the computer only
ever works on at least one Byte: 8 binary digits.

**Through the boolean lense, numbers are interpreted in this way: if the number
is `0`, it is `false`; otherwise, it is `true`.**

```rec: Example
So our `163` is `true` if we look at it as a boolean value.
```

<p align="center">
  <img alt="Phineas meme: &quot;Isn't it a little wasteful? - Yes, yes it is&quot;"
    src="imgs/FWastefulMeme.jpg"/>
</p>

Now, programmers usually hate wasting. If you are curious you can expand this
box:

````info> Can we do better? Bytes as multiple booleans...

Sometimes, we want to store several true/false values, for instance when storing
user preferences which are often a collection of yes/no answers. In this case,
we sometimes decide to look at the Byte as multiple true/false values at once.

Since a simple true/false value can be expressed using a single binary digit (0,
1), and a Byte is made of 8 binary digits, we can store the values of up to 8
true/false values in a single Byte.

The downside of this approach is its added complexity: it is a little more
involced and more error-prone to write and retrieve these values.

Readers who are familiar with binary representations probably understand this
immediately.

Since a Byte is a number made of 8 digits that can take one of two values each
(0 or 1), each digit can encode a true (1) or false (0) value.

You could visualise the Byte as a row of 8 switches:

<p align="center">
  <img alt="8 switches" src="imgs/8switches.webp"/>
</p>

Each switch is one of the 8 digits, and when the switch is off, that specific
digit is 0; when that switch is on, that specific digit is 1.

```rec: Example
The number `163` in this representation would be Switch 1, 3, 7, and 8 in
position "On", and Switches 2, 4, 5, and 6 in position "Off".
<br/>
Or the sequece `true`, `false`, `true`, `false`, `false`, `false`, `true`,
`true`.
```

````

### Signed Bytes

A range from 0 to 255 is useful, but sometimes we also want to use negative
values. Since our Byte can only represent 256 distinct values, we will have to
repurpose some of its values to become negative.

<svg width="592" height="50" style="display:block;margin:auto; --rect-width: 588px;--neg-width: 294px;">
    <rect x="2" y="2" style="width:var(--neg-width);" height="40" fill="var(--rec)" stroke="rgb(128,128,128)" stroke-width="2"/>
    <rect x="2" y="2" style="transform:translateX(var(--neg-width));width:calc(var(--rect-width) - var(--neg-width));" height="40" fill="var(--tri)" stroke="rgb(128,128,128)" stroke-width="2" />
    <text x="2" y="27" style="transform:translateX(calc(var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[0..127]</text>
    <text x="2" y="27" style="transform:translateX(calc(3 * var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[128..255]</text>
</svg>

<br/>We achieve this by splitting the values of the Byte in two. The first half
remains unchanged: [0..127] continue to represent the numbers from 0 to 127, but
the second half, from 128 to 255 is moved to the negative range.<br/>

<svg width="592" height="100" style="display:block;margin:auto; --rect-width: 588px;--neg-width: 294px;" viewBox="-100,0,592, 100">
    <rect x="2" y="2" style="transform:translateX(var(--neg-width));width:var(--neg-width);" height="40" fill="none" stroke="rgb(128,128,128)" stroke-width="2" stroke-dasharray="5,5" />
    <rect x="2" y="2" style="transform:translateX(calc(-1 * var(--neg-width)));width:var(--neg-width);" height="40" fill="none" stroke="rgb(128,128,128)" stroke-width="2" stroke-dasharray="5,5" />
    <rect x="2" y="2" style="width:var(--neg-width);" height="40" fill="var(--rec)" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="55" style="transform:translateX(50px);width:calc(var(--rect-width) - var(--neg-width));" height="40" fill="var(--tri)" stroke="rgb(128,128,128)" stroke-width="2"/>
    <text x="2" y="27" style="transform:translateX(calc(var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[0..127]</text>
    <text x="2" y="80" style="transform:translateX(calc(50px + var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[128..255]</text>
    <path d="M 400,27 Q 400,80 346,80" fill="none" stroke="var(--tri-border)" stroke-width="2" />
    <path d="M -80,27 Q -80,80 55,80" fill="none" stroke="var(--tri-border)" stroke-width="2" />
    <path d="M -80 25 L -85 37 L -72 35 Z" fill="var(--tri-border)" />
</svg>

<br/>
We have to be a little careful there. In a similar way that the character `'1'`
was an interpretation of the number `49`, the negative numbers [-128..-1] are an
interpretation of the numbers in the range [128..255].
<br/><br/>

<svg width="592" height="100" style="display:block;margin:auto; --rect-width: 588px;--neg-width: 294px;">
    <rect x="2" y="2" style="width:var(--neg-width);" height="40" fill="var(--tri)" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="transform:translateX(var(--neg-width));width:calc(var(--rect-width) - var(--neg-width));" height="40" fill="var(--rec)" stroke="rgb(128,128,128)" stroke-width="2"/>
    <text x="2" y="27" style="transform:translateX(calc(var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[-128..-1]</text>
    <text x="2" y="27" style="transform:translateX(calc(3 * var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[0..127]</text>
    <path d="M 3 22 L 12 72" stroke="var(--text)" stroke-width="2"/>
    <text x="15" y="69" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="start">This value is still 128,</text>
    <text x="15" y="89" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="start">but it now represents -128</text>
    <path d="M 293 22 L 284 72" stroke="var(--text)" stroke-width="2"/>
    <text x="287" y="69" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="start">This value is still 255,</text>
    <text x="287" y="89" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="start">but it now represents -1</text>
</svg>

<br/>
To look at it the other way around:

<svg width="592" height="100" style="display:block;margin:auto; --rect-width: 588px;--neg-width: 294px;">
    <rect x="2" y="2" style="width:var(--neg-width);" height="40" fill="var(--rec)" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="transform:translateX(var(--neg-width));width:calc(var(--rect-width) - var(--neg-width));" height="40" fill="var(--tri)" stroke="rgb(128,128,128)" stroke-width="2" />
    <text x="2" y="27" style="transform:translateX(calc(var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[0..127]</text>
    <text x="2" y="27" style="transform:translateX(calc(3 * var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[-128..-1]</text>
    <path d="M 2 40 L 2 60" stroke="var(--text)" stroke-width="2"/>
    <text x="0" y="75" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="start">0</text>
    <path d="M 294 40 L 292 60" stroke="var(--text)" stroke-width="2"/>
    <text x="292" y="75" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="end">127</text>
    <path d="M 298 40 L 300 60" stroke="var(--text)" stroke-width="2"/>
    <text x="300" y="75" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="start">128</text>
    <path d="M 590 40 L 590 60" stroke="var(--text)" stroke-width="2"/>
    <text x="592" y="75" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="end">255</text>
</svg>

<br/>

```rec: Example
In this representation, our `163` is above 127, so it is interpreted as a
negative number: `-93`.
```

````trivia: Subtlety
Notice the asymetry between the largest `127` and lowest `-128` values that can
be represented with a signed Byte.

This is due to having `0` between the strictly positive and strictly negative
numbers, but an even number of possible values for a Byte (256). So there are
128 strictly negative values, 1 zero, and 127 strictly positive values.

Because of this, taking the negative of a signed Byte whose value is `-128` is
an invalid operation (Undefined Behaviour), as it would yield `128` which cannot
be represented as a signed Byte. In practice, although doing this operation
could lead to a crash, many compilers would return `-128` as the result for this
operation (`-(-128)` => `-128`), which is obviously mathematically incorrect,
and can be quite confusing.

```info> Why? (Requires familiarity with binary representations)
In practice, to negate a signed integer, the CPU is likely to invert all the
bits and add 1.

Yes, that works. In all the valid cases.

- Consider `1`. Inverting all the bits gives `0b11111110` (`0xFE`). And adding 1
  to this gives `0b11111111` (`0xFF`), 255, which, if you check above, happens
  to be the representation of `-1` (255),
- Consider `-127`, which is `0b10000001` (`0x81`). If we invert it, we get
  `0b01111110` (`0x7E`). + 1 => `0b01111111` (`0x7F`), 127.
- Consider `0`. Inverting all the bits gives `0b11111111` (`0xFF`). Add 1 and
  every digit carries to the next, until the carry exceeds the number of digits,
  leaving only 0s: `0b00000000` (`0x00`).

But what happens with `-128`? We apply same pattern, of course.
- `-128` is `0b10000000` (`0x80`). When we invert it, we get `0b01111111`
  (`0x7F`). To which we add 1, giving `0b10000000` (`0x80`).
```

````

### Bytes as light intensity

Some interpretations are relatively straight-forward. The screen displays
pixels, and these pixels can send more or less light intensity. We can interpret
the value of a Byte as how bright we want a pixel to be.

- At `0`, it is black <span style="display: inline-block; width: 1.1em; height: 1.1em; background-color: #000000;border: 1px solid var(--text);vertical-align:middle;"></span>.
- At `255`, it is white <span style="display: inline-block; width: 1.1em; height: 1.1em; background-color: #ffffff;border: 1px solid var(--text);vertical-align:middle;"></span>.
```rec: Example
- At `163`, it is a medium light-ish gray <span style="display: inline-block; width: 1.1em; height: 1.1em; background-color: #A3A3A3;border: 1px solid var(--text);vertical-align:middle;"></span>.
```

### Byte as &real;eal numbers

We now have positive and negative numbers, but there's a whole infinity of
numbers between 0 and 1. How do we tap into this range? As we have said before,
we only have 256 different values for a Byte, so we will have to find strategies
to use these values wisely. The most common way is through floating-point, but
floating-points are complicated.

#### Byte as Fixed point

For now, we will look at the much simpler fixed point.

Counting from 0 to 255 was easy enough. What if we decided they were not wholes
but halves? Now we have 0, 0.5, 1, 1.5, 2... all the way up to 127.5; What if we
decided we are counting quarters, or eigths? This is just another filter of
interpretation.

We could combine the [Signed Byte](#signed-bytes) trick with this, and have
signed values that represent 8th: [-16, -15.75, -15.5, -15.25 .. -0.5, -0.25, 0,
0.25, 0.5 .. 15.25, 15.5, 15.75].

```rec: Example
For `163`, as a signed fixed-point with 5 signed integer binary digits and 3
fractional binary digits (i.e. made of 8<sup>th</sup>), we have already worked
out that it reads as `-93` as a [Signed Byte](#signed-bytes). If we consider it
made of 8<sup>th</sup>, we have -93/8 = `-11.625`. 
```

#### > Byte as floating point...

The floating-point representation will make more sense later on, but I wanted to
introduce it here, as it is heavily used in all kind of applications, and more
tricky than most people realise.

One key idea behind this representation is that we usually care about precision
for small numbers, and not so much for large ones. For instance, over a
centimeter or an inch, I care about a millimeter. But over a kilometer or a
mile, not so much.

So we will try to spread our 256 values in such a way that we have many values
close together near 0, and fewer as we step away from 0.

This representation breaks our 8 binary digits into 3 parts:
- The first digit is for the *sign* of the number: 0 for positive numbers, 1 for
  negative numbers.
- Then a few digits for something called the *Exponent*.
- And the remaining digits for what is called the *Mantissa*.

There are different format. For our purpose, we will choose:
- 1 binary digit (bit) for the sign,
- 4 bits for the Exponent,
- 3 bits for the Mantissa.

This means that every 8 (2<sup>3</sup>) values, we will double the space between our
values when we step away from 0.

**The short version is that the number is computed as `sign`
2<sup>`Exponent`</sup> `Mantissa`.**

<svg width="100%" viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg" role="img">
<title>Three exponent bands of an 8-bit float, each twice the width of the last</title>
<desc>A number line divided into three labelled regions I, II, and III, laid out edge to edge. Each region holds exactly 8 representable values, evenly spaced within it, but region II is twice as wide as region I, and region III is twice as wide as region II. The gap at each junction equals the new band's spacing, the moment the step size doubles.</desc>
<rect x="40.00" y="40" width="85.71" height="80" rx="6" fill="var(--rec-border)" fill-opacity="0.18"/>
<rect x="125.71" y="40" width="171.43" height="80" rx="6" fill="var(--tri-border)" fill-opacity="0.18"/>
<rect x="297.14" y="40" width="342.86" height="80" rx="6" fill="var(--imp-border)" fill-opacity="0.18"/>
<g stroke="var(--rec-label)" stroke-width="2">
<line x1="40.00" y1="50" x2="40.00" y2="120"/>
<line x1="50.71" y1="50" x2="50.71" y2="120"/>
<line x1="61.43" y1="50" x2="61.43" y2="120"/>
<line x1="72.14" y1="50" x2="72.14" y2="120"/>
<line x1="82.86" y1="50" x2="82.86" y2="120"/>
<line x1="93.57" y1="50" x2="93.57" y2="120"/>
<line x1="104.29" y1="50" x2="104.29" y2="120"/>
<line x1="115.00" y1="50" x2="115.00" y2="120"/>
</g>
<g stroke="var(--tri-label)" stroke-width="2">
<line x1="125.71" y1="50" x2="125.71" y2="120"/>
<line x1="147.14" y1="50" x2="147.14" y2="120"/>
<line x1="168.57" y1="50" x2="168.57" y2="120"/>
<line x1="190.00" y1="50" x2="190.00" y2="120"/>
<line x1="211.43" y1="50" x2="211.43" y2="120"/>
<line x1="232.86" y1="50" x2="232.86" y2="120"/>
<line x1="254.29" y1="50" x2="254.29" y2="120"/>
<line x1="275.71" y1="50" x2="275.71" y2="120"/>
</g>
<g stroke="var(--imp-label)" stroke-width="2">
<line x1="297.14" y1="50" x2="297.14" y2="120"/>
<line x1="340.00" y1="50" x2="340.00" y2="120"/>
<line x1="382.86" y1="50" x2="382.86" y2="120"/>
<line x1="425.71" y1="50" x2="425.71" y2="120"/>
<line x1="468.57" y1="50" x2="468.57" y2="120"/>
<line x1="511.43" y1="50" x2="511.43" y2="120"/>
<line x1="554.29" y1="50" x2="554.29" y2="120"/>
<line x1="597.14" y1="50" x2="597.14" y2="120"/>
</g>
<text x="82.86" y="32" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="15" font-weight="600" fill="var(--text)">I</text>
<text x="211.43" y="32" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="15" font-weight="600" fill="var(--text)">II</text>
<text x="468.57" y="32" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="15" font-weight="600" fill="var(--text)">III</text>
<text x="82.86" y="148" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="13" fill="var(--text)">8 values</text>
<text x="211.43" y="148" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="13" fill="var(--text)">8 values</text>
<text x="468.57" y="148" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="13" fill="var(--text)">8 values</text>
<text x="82.86" y="166" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" fill="var(--muted)">width w</text>
<text x="211.43" y="166" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" fill="var(--muted)">width 2w</text>
<text x="468.57" y="166" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" fill="var(--muted)">width 4w</text>
</svg>

But that's not even half of the headache.

- The `sign` is simple enough, let's celebrate this.
- The `Exponent` has special values. Both it's minimum and maximum values as
  special.
- The other values of the `Exponent` that are less special have a "bias".
  Nothing romantic, it means that we have to subtract a specific value (the
  bias) from the raw number to know its value. For our format, we will choose a
  bias of 7. So if the raw value of the Expnent is 1, we should read the exponent
  as -6. If the raw value is 7, we should read it as 0. If the raw value is 14 (1
  less than the maximum value we can represent with 4 bits), we should read it as 7.
- The `Mantissa` is a [fixed point](#byte-as-fixed-point) number. It is scaled
  based on its number of bits: if it has 3 digits, it is divided by
  2<sup>3</sup> (i.e. it represents 8<sup>th</sup>).
- If the `Exponent` raw value is not 0 (which is a special case mentioned
  above), the `Mantissa` should be read as if there was an additional digit set
  to 1 before it (implicit leading 1).

And then there are all the special cases.

```rec: Example
For instance, if I was to split `163` according to our format, I would get this:
- `1` for the sign,
- `4` for the raw Exponent,
- `3` for the Mantissa.

The Exponent is neither 0 nor 15, so we read it by subtracting 7 from it. 
4 - 7 = `-3`.

Since the Exponent is not 0, we should read the Mantissa as a fixed point number
made of 8<sup>th</sup> and add a leading 1 before it. Three 8<sup>th</sup> is
`0.375`, and with a leading 0, we get `1.375`.

We can finally form the final result: - 2<sup>-3</sup> × 1.375 = - 0.125 × 1.375 = `-0.171875`.
```

The subtlety and complexity of floating point numbers is astonishing, but
fortunately, their usage is simple. This makes them a double-edged sword: easy
to use and powerful... until we start to look at them from up close.

```trivia: What that complexity buys us
While this representation is particularly complex, it has a great advantage:

Even our naive 1-4-3 format allows to represent values both positive and
negative with magnitudes as large as `240` (though near that magnitude
consecutive values are spaced 16 apart), or as small as `0.015625` (with a gap
of only about 0.002 between consecutive values at that scale).

Floating points should be used in situations where we accept this property:
It is precise around `0` but that precision degrades as the values grow in
magnitude.
```

### The many Faces of a Byte

```rec
That was 6 (or 8 if you went through the secret sections) different ways to look
at a single Byte. We are barely scrathing the surface, but hopefully, you start
to see how a universe made of nothing else than numbers might not be boring
afterall.

The concept behind these interpretations of a same number is **fundamental** for
programmers, and we will encounter it at every turn: it is the notion of
***semantic***: the specific meaning that the data encodes. 
```

Let's take a few minutes to experiment and play with the different
representations of a Byte we have discussed above.

```gadget
src: gadgets/byte-lens.html
height: 300
```

## A Handful of Bytes

There is only so much we can do with 256 values.

### Two Bytes

In decimal, 2-digit numbers give 100 different values (0..99). But if we stack
together two of those, we get a 4-digit number which can represent 10.000 values
(0..9999).

In the same way, if we stack two Bytes together, we don't just double the number
of possible values, we multiply them, giving `65,536` possible values.

We will come back to values encoded over two Bytes a bit later, especially when
we look at audio formats.

### A different kind of Word

A Word in computing, used to refer to the "default" or "natural" size of the
data for a specific architecture. So a Word is not a specific, set number of
Bytes. The default size of a unit of data grew over time, and is often, 
currently, either 4 Bytes (32 bits) or 8 Bytes (64 bits) for the most common
architectures.

```trivia> The word "Word" is ambiguous...
The x86 architecture used, a long time ago, a Word that was 2 Bytes long. When
they later doubled that, evolving the architecture to use 4-Byte-long values as
the natural "default", they decided to keep their old definition of Word as a
2-Byte-long value, and called the new 4-Byte values Doubleword (DWORD). Later,
8-Byte-long values were introduced as Quadwords (QWORD).

This departure from the original definition of a Word creates ambiguity, and we
will prefer starting to call the types by their number of bits (a bit is a
binary digit, there are 8 bits in a Byte). 
```

### What does that change?

- For the unsigned integral numbers, the range of representable numbers grows
  (a lot).
  - [0, 4,294,967,295] with 4 Bytes (32 bits).
  - [0, 18,446,744,073,709,551,615] with 8 Bytes (64 bits). (Yes, that's 18 Quintillions.)
- For signed integral,
  - [-2,147,483,648, 2,147,483,647] with 4 Bytes (32 bits),
  - [-9,223,372,036,854,775,808, 9,223,372,036,854,775,807] with 8 Bytes (64 bits).
- For booleans,
  - nothing changes in their basic interpretation.
  - Interpreted as several booleans, they can now represent 32 or 64 boolean values at once.
- Characters are usually represented with smaller values, over one or two Bytes only.
- A fixed-point number over 4 Bytes (32 bit) can represent values up
  to 20,000 with a 0.000,01 (10<sup>-5</sup>) precision. That's enough to
  measure half the perimeter of the Earth in kilometers while retaining a
  precision at the centimeter.
- Floating-point values also benefit a lot from the additional Bytes.
  - A 32-bit (4 Byte) float can hold 8,388,608 different values per exponent
    band (where our 8-bit representation could only hold 8).
  - It can represent the value 2<sup>-149</sup> which is roughly 1.4&times;10<sup>-45</sup>.
  - It can also represent a value that is about 2.43&times;10<sup>73</sup>.
  - A 64-bit (8 Byte) floating-point number has 4,503,599,627,370,496 values
    per exponent band.
  - It can hold values as small as about 4.94&times;10<sup>-324</sup> and as
    large as about 1.8&times;10<sup>308</sup>.
  - But remember, with floating-point values, the precision scales with the number.
    - For a 32 bit float (4 Bytes), around 10,000,000, the precision is down to
      1 (10,000,001 is representable, but not 10.000.000,5).
    - With 64 bits (8 Bytes), around 10,000,000, the precision remains much
      higher at about 1.86&times;10<sup>-9</sup> (that's roughly 10 nanometer
      precision over the circumference of the Earth).

That's a lot of numbers to play with. Mostly, enough for our purpose. But one
reasons we want such enormous ranges of numbers is also that we need room for
calculations. Sometimes we will square, cube, or take an even higher power of a
number. That makes for large values we need to be able to work with.

## Even more Bytes

Eventually, we'll want to express more than just characters or a light
intensity. We will want to express text and images.

### Text

If we keep to our [ASCII](#bytes-as-characters) representation where a single
Byte is a character, a text is simple: it is many Bytes, one after the other,
each representing a different character.

In C++, to make it clear where such a sequence of characters ends, we require
that it ends with a special character: the "null character", sometimes noted
'`\0`' (which has the value `0`).

```rec: Example
So `76`, `105`, `107`, `101`, `32`, `116`, `104`, `97`, `116`, `46`, `0` can
represent the words: "Like that.", complete with a null character at the end.
```

### Image

In a similar way, a sequence of numbers, of Bytes, can be interpreted as an
image. But for an image, we want to keep the value `0` for "completely black",
we we can't use the same trick as the text to know when to stop.

In addition, our image is 2D, it has a width and a height. We will need to know
that if we want to display it properly.

One solution would be to store these two values, as plain integral numbers.

For instance, a [Word](#a-different-kind-of-word) for the Width of the image,
another Word for its height, and then we know that the picture will be made of
*width*&times;*height* light intensity values, so we know how many Byte
light-intensity value we expect next.

```rec: Example
Suppose we have an image that is 11 pixels wide, and 8 pixels high.
We could write this:
- `11` (our width)
- `8` (our height)
- `0`, `0`, `255`, `0`, `0`, `0`, `0`, `0`, `255`, `0`, `0`
- `0`, `0`, `0`, `255`, `0`, `0`, `0`, `255`, `0`, `0`, `0`
- `0`, `0`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `0`, `0`
- `0`, `255`, `255`, `128`, `255`, `255`, `255`, `128`, `255`, `255`, `0`
- `255`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `255`
- `255`, `0`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `0`, `255`
- `255`, `0`, `255`, `0`, `0`, `0`, `0`, `0`, `255`, `0`, `255`
- `0`, `0`, `0`, `255`, `255`, `0`, `255`, `255`, `0`, `0`, `0`

If our Word size is 4 Bytes (32-bit architecture), that would be 96 Bytes that
we can interpret as an image.
```

```trivia> Colour Images
If we wanted to display a colour image, we could use more Byte values.

Since the human eye can usually detect only 3 distinct elementary colours at
best (colour-blind people might perceive less, and tetrachromat people have a
4<sup>th</sup> one), screen technologies emit 3 distinct colours that we blend
to generate all the colours most people will be able to perceive.

These colours are Red, Green, and Blue. When emitting the 3 together (in the
correct blend), the eye perceives it as white.

So instead of having one picture expressing a light intensity, which would
result in a greyscale image, we can have 3 such images:
- One for the Red light intensity,
- One for the Green light intensity,
- One for the Blue light intensity.

If we want to be able to express a transparency for our image, we can add a
fourth sequence of Bytes, representing that transparency (usually 0 for
transparent and 255 for opaque).

We can either keep these sequences one after the other (no need to repeat the
width and height, they will be the same for each sequence), or interleave them,
with a Byte for the Red, followed by a Byte for the Green, followed by a Byte
for the Blue, and finally a Byte for the transparency. This is often referred to
as RGBA.
```

### > Sound

A sequence of values can also express sound. A speaker is essentially a system
where electricity is converted into a magnetic field, which in turn pushes or
pulls a magnet attached to a membrane. The movement of this membrane sets the
surrounding air in motion, and if it makes it vibrate somewhere between 20 times
per second and 20,000 times per seconds, that's sound.

So a series of values (a single Byte each, or often, two-Byte (16 bits) each)
can represent exactly this movement.

There has been several format over time. In some old format, we use an unsigned
8-bit value. `0` means pulling the mambrane as far as it goes, and `255` pushing it
as far as it goes the other way.

Modern formats usually use signed values, often over 16 bits (2 Bytes), with a
clearer `0` means leaving the membrane at rest.

Worth noting that outputting random values to a speaker can damage it. The
membrane is built to oscillate at specific frequencies with specific
intensities. Please be careful if you play with that.
