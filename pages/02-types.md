---
title: "02 — Types"
prev: "01-data"
next: "03-processing"
---

# 02 - Types

In [this previous chapter](./?page=01-data), we have seen that the same value
can be interpreted in many different ways. We will soon see that this makes no
difference for the processor, which will mostly operate on the values without
consideration for what these values represent.

This means that the responsibility of knowing what a value represents and how it
should be interpreted is mostly on the programmer. In complex programs, keeping
tabs on this consistently by hand would be difficult, error-prone, and take a
lot of time.

Different languages have different solutions for this.

## The C++ type system

C++ offers a type system to help the programmer keep track of how values should
be interpreted. The main job of this system is to prevent mistakes with this
while avoiding excessive friction.

When specifying a value, the programmer is encouraged to also specify its type.
The compiler keeps track of this type throughout the lifespan of the value and
uses it to enforce some boundaries or warn the programmer about misuse or likely
transgressions.

C++ is **statically typed**, which means that these verifications happen once when
the application is built from the code, and not during the application's
execution (runtime).

### Keeping track of the "semantic"

```illus: Example
- The type `char` means a Byte that should be interpreted as [an ASCII code for a
character](?page=01-data#bytes-as-characters).
- The type `bool` often means a single Byte (although it can be more than one
  Byte for some architectures/compilers), that should be interpreted as a
  Boolean value.
- The type `std::int8_t` means a Byte that should be interpreted as a signed
  integer. 
- The type `std::uint8_t` means a Byte that should be interpreted as an unsigned
  integer.
- The type `std::byte` specifically means a Byte without specifying a designated
  way of interpreting it and is used to mean a Byte as "raw data".
```

On an typical architecture where a Byte is 8 bits (otherwise, `std::int8_t` and
`std::uint8_t` would not make sense, and thus not exist), and a `bool` uses 1
Byte, these 5 types are strictly the same thing from the processor's point of
view. But we should read their bits in very different ways.

In this case, the distinction between these types doesn't inform the processor
on how these values should be processed, it informs the programmer (and the
compiler) of how they should be interpreted.

### Keeping track of the size

The type also encodes in the compiler the number of Bytes (the size) of the
value.

```illus: Example
- `std::uint8_t` is a single Byte unsigned integral value.
- `std::uint16_t` is a two Bytes unsigned integral value.
- `std::uint32_t` is a four Bytes unsigned integral value.
- `std::uint64_t` is a eight Bytes unsigned integral value.
```

In this case, in addition to carrying the information of how these values should
be read (as unsigned integral values), the type also encodes the minimal size
required to manipulate this value.

```pitfall
There is an important distinction to be made here: the type tells the compiler
the size of the value, but different compilers/architectures can give different
size to the same type.

A given compiler has to be consistent, but different compilers don't have to
agree.

For instance, the type `size_t` has a size of 4 Bytes on x86 architectures,
while it has a size of 8 Bytes on x64 architectures.

This remains consistent on the given architecture, but changes across
architectures. In other words, while the size of a type is known with certainty
by the compiler, it can sometimes be confusing for the programmer.
```

```principle
A type encodes the size (number of Bytes) and semantic (how to interpret it) for
a category of values.
```

