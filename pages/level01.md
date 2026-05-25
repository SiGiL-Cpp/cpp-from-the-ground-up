# 01 - Data

At the core, a computer is a glorified calculator. It manipulates numbers. This means that whether we browse videos online or play a video game, all we see is built off numbers.

Building a robust understanding of this simple idea will be useful as we explore and "rebuild" C++ from its most elementary pieces.

```trivia
Excellence (in pretty much any domain) is better demonstrated by a deep mastery of its basics, rather than a catalog of obscure subtleties.
```

Suppose we have the number `163`. How many ways can we find to look at it? We will consider at least 5 in this page.

## Byte

In base 10 (decimal), where each of the digit used to write a number can take one of 10 values (0..9), a 3-digit number can express 1000 different values: from 0 to 999.

Similarly, in base 2 (binary), where each of the digit used to write a number can take only one of 2 values (0, 1), a **Byte** is an 8-digit number which can express 256 different values: from 0 to 255.

```ref
We won't go in details over the binary representation of numbers for now as it is not required for our current purpose. If you wish to investigate the subject, there are many good resources on the subject.
- [Khan Academy](https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:digital-information/xcae6f4a7ff015e7d:binary-numbers/a/bits-and-binary)
- [Practical Networking Youtube](https://www.youtube.com/watch?v=RrJXLdv1i74)
```

Our number `163` is within the [0..255] range of values, so it can be represented by a Byte.

### Bytes as characters

Since 1961, we have been using a standard called [ASCII](https://en.wikipedia.org/wiki/ASCII) which matches numbers between 0 and 255 to specific characters. According to this convention, the number `163` represents the character `'£'`.

It is worth noting that the character `'1'` in the ASCII standard is associated to the number `49`. Although this number can seem arbitrary when expressed in decimal, it makes more sense for those familiar with its binary representation (32 + 16 + 1).

It is a very common way of interpreting numbers as (latin) characters, but by no means the only one.

### Bytes as true/false, on/off, yes/no values

Such value pairs are called Boolean values (from [George Boole](https://en.wikipedia.org/wiki/George_Boole)), and are extremely common as they represent the simplest switch between two states, such as the dark/light theme switch in the upper-right corner of this page, the ever-present tickbox, or a light switch.

Although only one binary digit (0, 1) would be sufficient to encode this information, in C++ a full Byte (8 binary digits) are used for the boolean representation. The reasons for this will be explained much later in this series, but for now, a hand-wavy explanation would be that the computer only ever works on at least one Byte, 8 binary digits.

**Through the boolean lense, numbers are interpreted in this way: if the number is `0`, it is `false`; otherwise, it is `true`.**

So our `163` is `true` if we look at it as a boolean value.

<p align="center">
<img alt="Phineas meme: \"Isn't it a little wasteful? - Yes, yes it is\"" src="imgs/FWastefulMeme.jpg"/>
</p>

```fold
#### [...] Bytes as multiple booleans

Sometimes, we want to store several true/false pairs, for instance when storing user preferences which are often a collection of yes/no values. In this case, we sometimes decide to look at the Byte as multiple true/false values at once. Since a simple true/false value can be expressed using a single binary digit (0, 1), and a Byte is made of 8 binary digits, we can store the values of up to 8 true/false values in a single Byte.

The downside of this approach is its added complexity: it is more complex and more error-prone to write and retrieve these values.

Readers who understand binary should understand this structure easily. The following explanation explains it without resorting to binary understanding.

With a regular boolean values, the partition between true and false values looks like this:

<svg width="80%" height="110" style="display:block;margin:auto; --rect-width: calc(100% - 4px);--false-width: calc( var(--rect-width) / 256);">
    <rect x="2" y="2" style="width:var(--rect-width);" height="40" fill="none" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="width:var(--false-width);" height="40" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="2" style="transform:translateX(var(--false-width));width:calc(var(--rect-width) - var(--false-width));" height="40" fill="rgb(0,128,0)" stroke="none" />
    <line style="x1: calc(2px + var(--false-width) / 2);" x2="42" y1="42" y2="80" stroke="rgb(255,0,0)" stroke-width="2" />
    <text x="45" y="85" fill="rgb(255,0,0)" font-family="sans-serif" font-size="14" text-anchor="left">false</text>
</svg>

Suppose we split the values evenly instead:

<svg width="80%" height="50" style="display:block;margin:auto; --rect-width: calc(100% - 4px);--false-width: calc( var(--rect-width) / 2);">
    <rect x="2" y="2" style="width:var(--rect-width);" height="40" fill="none" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="width:var(--false-width);" height="40" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="2" style="transform:translateX(var(--false-width));width:calc(var(--rect-width) - var(--false-width));" height="40" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="27" style="transform:translateX(calc(var(--false-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">false</text>
</svg>

This would mean that the values between 0 and 127 are false, and the values between 128 and 255 are true.

But what if we split both these ranges in two again: [0..63], [64..127], [128..191], and [192..255]? Since we have now four options, we could represent two true/false boolean values:
- [0..63] represents both values being `false`.
- [64..127] represents the first value being `false`, but the second being `true`.
- [128..191] represents the first value being `true`, but the second being `false`.
- [192..255] represents both values being `true`.

<svg width="80%" height="50" style="display:block;margin:auto; --rect-width: calc(100% - 4px);--false-width: calc( var(--rect-width) / 2);">
    <rect x="2" y="2" style="width:var(--rect-width);" height="40" fill="none" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="width:var(--false-width);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="2" style="transform:translateX(var(--false-width));width:calc(var(--rect-width) - var(--false-width));" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="17" style="transform:translateX(calc(var(--false-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">1: false</text>
    <rect x="2" y="22" style="width:calc(var(--false-width) / 2);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="22" style="transform:translateX(calc(var(--false-width) / 2));width:calc(var(--rect-width) / 2 - var(--false-width) / 2);" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="37" style="transform:translateX(calc(var(--false-width) / 4));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">2: false</text>
    <rect x="2" y="22" style="transform:translateX(var(--false-width));width:calc(var(--false-width) / 2);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="22" style="transform:translateX(calc(3 * var(--false-width) / 2));width:calc(var(--rect-width) / 2 - var(--false-width) / 2);" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="37" style="transform:translateX(calc(5 * var(--false-width) / 4));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">2: false</text>
</svg>

We now represent two boolean values over this Byte, but we can continue further. Our four ranges of 64 values each can be split into 2 each, giving us 8 ranges of 32 values each.
And in the same way as before, it allows us to encode an additional boolean value:
- [0..31] all three values are `false`.
- [32..63] values 1 and 2 are `false`, value 3 is `true`.
- [64..95] values 1 and 3 are `false`, value 2 is `true`.
- [96..127] value 1 is `false`, values 2 and 3 are `true`.
- [128..159] values 2 and 3 are `false`, value 1 is `true`.
- [160..191] value 2 is `false`, values 1 and 3 are `true`.
- [192..223] value 3 is `false`, values 1 and 2 are `true`.
- [224..255] all trhee values are `true`.

<svg width="80%" height="70" style="display:block;margin:auto; --rect-width: calc(100% - 4px);--false-width: calc( var(--rect-width) / 2);">
    <rect x="2" y="2" style="width:var(--rect-width);" height="60" fill="none" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="width:var(--false-width);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="2" style="transform:translateX(var(--false-width));width:calc(var(--rect-width) - var(--false-width));" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="17" style="transform:translateX(calc(var(--false-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">1: false</text>
    <rect x="2" y="22" style="width:calc(var(--false-width) / 2);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="22" style="transform:translateX(calc(var(--false-width) / 2));width:calc(var(--rect-width) / 2 - var(--false-width) / 2);" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="37" style="transform:translateX(calc(var(--false-width) / 4));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">2: false</text>
    <rect x="2" y="22" style="transform:translateX(var(--false-width));width:calc(var(--false-width) / 2);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="22" style="transform:translateX(calc(3 * var(--false-width) / 2));width:calc(var(--rect-width) / 2 - var(--false-width) / 2);" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="37" style="transform:translateX(calc(5 * var(--false-width) / 4));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">2: false</text>
    <rect x="2" y="42" style="width:calc(var(--false-width) / 4);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="42" style="transform:translateX(calc(var(--false-width) / 4));width:calc(var(--rect-width) / 4 - var(--false-width) / 4);" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="57" style="transform:translateX(calc(var(--false-width) / 8));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">3: false</text>
    <rect x="2" y="42" style="transform:translateX(calc(var(--false-width) / 2));width:calc(var(--false-width) / 4);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="42" style="transform:translateX(calc(3 * var(--false-width) / 4));width:calc(var(--rect-width) / 4 - var(--false-width) / 4);" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="57" style="transform:translateX(calc(5 * var(--false-width) / 8));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">3: false</text>
    <rect x="2" y="42" style="transform:translateX(var(--false-width));width:calc(var(--false-width) / 4);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="42" style="transform:translateX(calc(5 * var(--false-width) / 4));width:calc(var(--rect-width) / 4 - var(--false-width) / 4);" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="57" style="transform:translateX(calc(9 * var(--false-width) / 8));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">3: false</text>
    <rect x="2" y="42" style="transform:translateX(calc(3 * var(--false-width) / 2));width:calc(var(--false-width) / 4);" height="20" fill="rgb(128,0,0)" stroke="none" />
    <rect x="2" y="42" style="transform:translateX(calc(7 * var(--false-width) / 4));width:calc(var(--rect-width) / 4 - var(--false-width) / 4);" height="20" fill="rgb(0,128,0)" stroke="none" />
    <text x="2" y="57" style="transform:translateX(calc(13 * var(--false-width) / 8));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">3: false</text>
</svg>

And we can continue to divide our 8 ranges of 32 values each into 16 ranges of 16 values each, adding a 4<sup>th</sup> boolean value.

- Then 32 ranges of 8 values, giving 5 boolean values,
- 64 ranges of 4 values, giving 6 boolean values,
- 128 ranges of 2 values, giving 7 booleans,
- and finally 256 ranges of 1 value, giving 8 booleans.

Or to look at it the binary way, each binaty digit (0, 1) of the Byte is its own boolean value, `false` when it is 0, and `true` when it is 1.

In this representation, our `163` means that the first, third, seventh, and eigth boolean values are `true`, while the others (2<sup>nd</sup>, 4<sup>th</sup>, 5<sup>th</sup>, and 6<sup>th</sup>) are `false`.

```

### Signed Bytes

A range from 0 to 255 is useful, but sometimes we also want to store negative values. Since our Byte can only represent 256 distinct values, we will have to repurpose some values to become negative.

<svg width="592" height="50" style="display:block;margin:auto; --rect-width: 588px;--neg-width: 294px;">
    <rect x="2" y="2" style="width:var(--rect-width);" height="40" fill="none" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="width:var(--neg-width);" height="40" fill="rgb(0,128,0)" stroke="none" />
    <rect x="2" y="2" style="transform:translateX(var(--neg-width));width:calc(var(--rect-width) - var(--neg-width));" height="40" fill="rgb(0,0,128)" stroke="none" />
    <text x="2" y="27" style="transform:translateX(calc(var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[0..127]</text>
    <text x="2" y="27" style="transform:translateX(calc(3 * var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[128..255]</text>
</svg>

We achieve this by splitting the values in two. The first half remains unchanged [0..127] continue to represent the numbers from 0 to 127, but the second half, from 128 to 255 is moved to the negative range.

<svg width="592" height="100" style="display:block;margin:auto; --rect-width: 588px;--neg-width: 294px;" viewBox="-100,0,592, 100">
    <rect x="2" y="2" style="width:var(--neg-width);" height="40" fill="none" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="transform:translateX(var(--neg-width));width:var(--neg-width);" height="40" fill="none" stroke="rgb(0,0,128)" stroke-width="2" stroke-dasharray="5,5" />
    <rect x="2" y="2" style="transform:translateX(calc(-1 * var(--neg-width)));width:var(--neg-width);" height="40" fill="none" stroke="rgb(0,0,128)" stroke-width="2" stroke-dasharray="5,5" />
    <rect x="2" y="2" style="width:var(--neg-width);" height="40" fill="rgb(0,128,0)" stroke="none" />
    <rect x="2" y="55" style="transform:translateX(50px);width:calc(var(--rect-width) - var(--neg-width));" height="40" fill="rgb(0,0,128)" stroke="none" />
    <text x="2" y="27" style="transform:translateX(calc(var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[0..127]</text>
    <text x="2" y="80" style="transform:translateX(calc(50px + var(--neg-width) / 2));" fill="var(--text)" font-family="sans-serif" font-size="14" text-anchor="middle">[128..255]</text>
    <path d="M 400,27 Q 400,80 346,80" fill="none" stroke="rgb(0,0,255)" stroke-width="2" />
    <path d="M -80,27 Q -80,80 55,80" fill="none" stroke="rgb(0,0,255)" stroke-width="2" />
    <path d="M -80 25 L -85 37 L -72 35 Z" fill="rgb(0,0,255)" />
</svg>

<br/>
We have to be a little careful there. In a similar way that the character `'1'` was an interpretation of the number `49`, the negative numbers [-128..-1] are an interpretation of the numbers in the range [128..255].
<br/><br/>

<svg width="592" height="100" style="display:block;margin:auto; --rect-width: 588px;--neg-width: 294px;">
    <rect x="2" y="2" style="width:var(--rect-width);" height="40" fill="none" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="width:var(--neg-width);" height="40" fill="rgb(0,0,128)" stroke="none" />
    <rect x="2" y="2" style="transform:translateX(var(--neg-width));width:calc(var(--rect-width) - var(--neg-width));" height="40" fill="rgb(0,128,0)" stroke="none" />
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
    <rect x="2" y="2" style="width:var(--rect-width);" height="40" fill="none" stroke="rgb(128,128,128)" stroke-width="2" />
    <rect x="2" y="2" style="width:var(--neg-width);" height="40" fill="rgb(0,128,0)" stroke="none" />
    <rect x="2" y="2" style="transform:translateX(var(--neg-width));width:calc(var(--rect-width) - var(--neg-width));" height="40" fill="rgb(0,0,128)" stroke="none" />
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
In this representation, our `163` is above 127, so it is interpreted as a negative number: `-93`.

&nbsp;

```trivia
Notice the asymetry between the largest `127` and lowest `-128` values that can be represented with a signed Byte.

This is due to having `0` between the strictly positive and strictly negative numbers, but an even number of possible values for a Byte (256). So there are 128 strictly negative values, 1 zero, and 127 strictly positive values.
```

### Bytes as light intensity

The screen displays pixels, and these pixels can send more or less light intensity. We can interpret the value of a Byte as how bright we want a pixel to be.

- At `0`, it is black <span style="display: inline-block; width: 1.1em; height: 1.1em; background-color: #000000;border: 1px solid var(--text);vertical-align:middle;"></span>.
- At `255`, it is white <span style="display: inline-block; width: 1.1em; height: 1.1em; background-color: #ffffff;border: 1px solid var(--text);vertical-align:middle;"></span>.
- At `163`, it is a medium light-ish gray <span style="display: inline-block; width: 1.1em; height: 1.1em; background-color: #A3A3A3;border: 1px solid var(--text);vertical-align:middle;"></span>.

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

In decimal, 2-digit numbers give 100 different values. But if we stack together two of those, we get a 4-digit number which can represent 10.000 values.

In the same way, if we stack two Bytes together, we don't just double the number of possible values, we multiply them, giving `65.536` possible values.

Although many things are "implementation defined", meaning that there are no hard and true rule, two Bytes together, or to put it another way, a 16 binary digit number, is often called a half-word.

A notable example of usage of 2-Byte wide values is windows "wide characters".

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
