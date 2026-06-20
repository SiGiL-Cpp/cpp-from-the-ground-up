# Page X — [Your Title Here]

This is the prose body of the page. Write freely in standard markdown.
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

```info> What happens if you dig deeper?
Use info boxes for optional depth — folded by default so they don't interrupt the main flow.

- Answers to hypothetical questions raised in the prose
- Deeper dives that would break the flow if left open
- Exercise answers the student should attempt before reading
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

And here is a gadget box — an iframe-based interactive component:

```gadget
src: gadgets/byte-lens.html
height: 300
```

## Custom titles & folding

Every box type accepts an optional suffix after the type name:

- `: Your Title` — custom title, not foldable
- `> Your Title` — foldable, **collapsed** by default  
- `< Your Title` — foldable, **expanded** by default
- nothing after the type — default title, not foldable

```rec: A custom recap title
This recap box has a custom title instead of the default "↩ Recap".
```

```important> Expand to see a hidden important note
Any box type can fold — rec, trivia, ref, info, playground, gadget.
This important box is collapsed by default but keeps its red styling.
```

```trivia< Already-open trivia box
This trivia box is foldable but starts expanded (the `<` marker).
Close it and reopen it to see the toggle in action.
```

Foldable boxes can contain nested boxes too. Use four backticks on the
outer fence so the inner three-backtick fence doesn't close it early:

````info> Show a nested example
This info box is collapsed and contains a nested box:

```important
Nested boxes work inside any foldable box.
```
````

## > A collapsed section

This whole section, including its prose, boxes, and sub-headings, is hidden until the reader expands it.

```rec
Boxes inside a folded section work exactly as normal.
```

### A nested subsection

Sub-headings inside a folded section are part of its content and fold along with it.

## < An expanded section

This section starts open (the `<` marker) but can still be collapsed by the reader.

### > A nested foldable subsection

This h3 is itself foldable, independent of its parent h2's fold state.
