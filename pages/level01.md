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
  <img alt="Phineas meme: \"Isn't it a little wasteful? - Yes, yes it is\""
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

The screen displays pixels, and these pixels can send more or less light intensity. We can interpret the value of a Byte as how bright we want a pixel to be.

- At `0`, it is black <span style="display: inline-block; width: 1.1em; height: 1.1em; background-color: #000000;border: 1px solid var(--text);vertical-align:middle;"></span>.
- At `255`, it is white <span style="display: inline-block; width: 1.1em; height: 1.1em; background-color: #ffffff;border: 1px solid var(--text);vertical-align:middle;"></span>.
- At `163`, it is a medium light-ish gray <span style="display: inline-block; width: 1.1em; height: 1.1em; background-color: #A3A3A3;border: 1px solid var(--text);vertical-align:middle;"></span>.

### Byte as fixed point

We now have positive and negative numbers, but there's a whole infinity of numbers between 0 and 1. How do we tap into this range? The most common way is through floating-point, but floating-points are complicated. I'll treat them as in a folding box just below. For now, we will look at the much simpler fixed point.

We have 256 values, ranging by default from 0 to 255. The question is how much detail do we want. We could decide that what we count, 0, 1, 2, 3, 4... are halves and not wholes, so it would go 0, 0.5, 1, 1.5, 2... Or we could decide we're counting quarters, or eigths. This is just another filter of interpretation.

We could combine that with the [Signed Byte](#signed-bytes) trick with this, and have signed values that represent 8th: [-32, -31.75, -31.5, -31.25 .. -0.5, -0.25, 0, 0.25, 0.5 .. 31.25, 31.5, 31.75].

For `163`, as a signed fixed-point with 4 integer binary digits and 3 fractional binary digits (i.e. made of 8<sup>th</sup>), we have already worked out that it reads as `-93` as a [Signed Byte](#signed-bytes). If we consider it made of 8<sup>th</sup>, we have -93/8 = `-11.625`.

```fold
### Byte as floating point

The floating-point representation will make more sense later on, but I wanted to introduce it here, as it is heavily used in all kind of applications, and more tricky than most people realise.

This representation breaks our 8 binary digits into 3 parts:
- The first digit is for the sign of the number: 0 for positive numbers, 1 for negative numbers.
- Then a few digits for something called the Exponent.
- And the remaining digits for what is called the Mantissa.

There are different format. In the E4M3 format, the Exponent uses 4 digits, and the Mantissa 3 (hence E4M3), leaving 1 digit for the sign.

The short version is that the number is computed as `sign` 2<sup>`Exponent`</sup> `Mantissa`.

But that's not even half of the headache.

- The `sign` is simple enough, let's celebrate this.
- The `Exponent` has special values. Both it's minimum and maximum values as special.
- The other values of the `Exponent` that are less special have a "bias". Nothing romantic, it means that we have to subtract a specific value (the bias) from the raw number to know its value. In E4M3 format the bias is typically 7. So if the raw value of the Expnent is 1, we should read the exponent as -6. If the raw value is 7, we should read it as 0. If the raw value is 14 (1 less than the maximum value we can represent with 4 bits), we should read it as 7.
- The `Mantissa` is a [fixed point](#byte-as-fixed-point) number. It is scaled based on its number of bits: if it has 3 digits, it is divided by 2<sup>3</sup> (i.e. it represents 8<sup>th</sup>).
- If the `Exponent` raw value is not 0 (which is a special case mentioned above), the `Mantissa` should be read as if there was an additional digit set to 1 before it (implicit leading 1).

And then there are all the special cases.

For instance, if I was to split `163` according to the E4M3 format, I would get this:
- `1` for the sign,
- `4` for the raw Exponent,
- `3` for the Mantissa.

The Exponent is neither 0 nor 15, so we read it by subtracting 7 from it. 4 - 7 = `-3`.

Since the Exponent is not 0, we should read the Mantissa as a fixed point number made of 8<sup>th</sup> and add a leading 1 before it. Three 8<sup>th</sup> is `0.375`, and with a leading 0, we get `1.375`.

We can finally form the final result: - 2<sup>-3</sup> × 1.375 = - 0.125 × 1.375 = `-0.171875`.

The subtlety and complexity of floating point numbers is astonishing, but fortunately, their usage is simple. This makes them a double-edged sword: easy to use and powerful... until we start to look at them from up close.

```

### The many Faces of a Byte

```rec
That was 5 different ways to look at a single Byte. We are barely scrathing the surface, but hopefully, you start to see how a universe made of nothing else than numbers might not be boring afterall.

The concept behind these interpretations of a same number is Fundamental for programmers, and we will encounter it at every turn: it is the notion of ***semantic***: the specific meaning that the data encodes.
```

Let's take a few minutes to experiment and play with the different representations of a Byte we have discussed above.

```gadget
src: gadgets/byte-lens.html
height: 300
```

## A Handful of Bytes

There is only so much we can do with 256 values.

### Two Bytes

In decimal, 2-digit numbers give 100 different values (0..99). But if we stack together two of those, we get a 4-digit number which can represent 10.000 values (0..9999).

In the same way, if we stack two Bytes together, we don't just double the number of possible values, we multiply them, giving `65.536` possible values.

We will come back to values encoded over two Bytes a bit later, especially when we look at audio formats.

### A different kind of Word

A Word in computing, used to refer to the "default" or "natural" size of the data for a specific architecture. So a Word is not a specific, set number of Bytes. The default size of a unit of data grew over time, and is often currently, either 4 Bytes (32 bits) or 8 Bytes (64 bits) for the most common architectures.

```trivia
The x86 architecture used, a long time ago, a Word that was 2 Bytes long. When they later doubled that, evolving the architecture to use 4-Byte-long values as the natural "default", they decided to keep their old definition of Word as a 2-Byte-long value, and called the new 4-Byte values Doubleword (DWORD). Later, 8-Byte-long values were introduced as Quadwords (QWORD).

This departure from the original definition of a Word creates ambiguity, and we will prefer starting to call the types by their number of bits (a bit is a binary digit, there are 8 bits in a Byte).
```





Why stop with only two Bytes stacked? A `Word`is the "default" or "natural" data size of a given computer architecture. These days, it is usually either 4 Bytes (32 bits) or 8 Bytes (64 bits).

--------



This is the prose body of the lesson. Write freely in standard markdown.
You can use **bold**, `inline code`, and so on.

```rec
This is a recap box. Use it to restate the key takeaway of a section in one or two sentences.
```

```important
This is an important highlight. Use it for things students must not skim past — a trap, a rule, a constraint.
```

Here's some more prose between boxes. The layout handles spacing automatically.

```trivia
This is a trivia box. Use it for interesting-but-not-essential context: history, etymology, platform quirks.
```

```ref
[cppreference — Fundamental types](https://en.cppreference.com/w/cpp/language/types)

Use ref boxes for curated external links. One link per box keeps it scannable.
```

```fold
#### What happens if you ask a deeper question?

This is a fold box. It is collapsed by default. Use it for:
- Answers to hypothetical questions raised in the prose
- Deeper dives that would break the flow
- Exercise answers the student should try before reading
```

And here is a playground box. The student only writes the body of `solve()`.
The boilerplate (includes, main, helper classes) is hidden.

```playground
id: stub-ex1
boilerplate_before: |
  #include <iostream>
  #include <string>

  void solve() {
boilerplate_after: |
  }

  int main() {
    solve();
    return 0;
  }
default_code: |
  std::cout << "Hello, types!" << std::endl;
```
