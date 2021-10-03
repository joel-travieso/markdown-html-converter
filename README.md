# Implement a Markdown => HTML converter

Markdown is a simple syntax used to generate formatted text. It’s used in lots
of places, but the one most developers have probably encountered is README
files in github.

For this exercise, we’d like you to write a program which converts a small
subset of markdown to HTML. You can implement this as a command-line program
or as a web application, whatever you’re more comfortable with.


## Formatting Specifics

Markdown is a fairly rich specification; for this assignment, we’re only
looking for a small subset. This is the formatting we’d like you to implement:

| Markdown                               | HTML                                              |
| -------------------------------------- | ------------------------------------------------- |
| `# Heading 1`                          | `<h1>Heading 1</h1>`                              | 
| `## Heading 2`                         | `<h2>Heading 2</h2>`                              | 
| `...`                                  | `...`                                             | 
| `###### Heading 6`                     | `<h6>Heading 6</h6>`                              | 
| `Unformatted text`                     | `<p>Unformatted text</p>`                         | 
| `[Link text](https://www.example.com)` | `<a href="https://www.example.com">Link text</a>` | 
| `Blank line`                           | `Ignored`                                         | 


## Some tests

Here are a few sample inputs. Your code should, of course, work with
any input that uses the formatting rules above, but you can use this
sample to get started testing.

```
# Sample Document

Hello!

This is sample markdown for the [Mailchimp](https://www.mailchimp.com) homework assignment.
```

We would expect this to convert to the following HTML:

```
<h1>Sample Document</h1>

<p>Hello</p>

<p>This is sample markdown for the <a href="https://www.mailchimp.com">Mailchimp</a> homework assignment</p>
```

Similarly, this sample:

```
# Header one

Hello there

How are you?
What's going on?

## Another Header

This is a paragraph [with an inline link](http://google.com). Neat, eh?

## This is a header [with a link](http://yahoo.com)
```

Would convert to the following HTML:

```
<h1>Header one</h1>

<p>Hello there</p>

<p>How are you?
What's going on?</p>

<h2>Another Header</h2>

<p>This is a paragraph <a href="http://google.com">with an inline link</a>. Neat, eh?</p>

<h2>This is a header <a href="http://yahoo.com">with a link</a></h2>
```

(Please note that newlines don't matter in HTML, so if your version has extraneous newlines that don't effect the overall output when rendered, that's OK.)


Please feel free to use libraries to generate HTML or otherwise make your life
easier. However, please don’t use a library that actually implements markdown
to HTML conversion for you! We recognize that this problem is, by its nature,
artificial, and that just finding a well-supported library would be the
preferred real-world solution to this question.


## What We’re Looking For

We’ll evaluate your assignment by looking for a few things:

* Functionality
    * Does the code do what it should?
    * Does it handle edge cases?
* Code quality
    * Is the code readable & maintainable?
    * Is there reasonable test coverage?
* Performance
    * Does the code balance reasonably fast execution with readability?
    * Can the implementation handle large inputs gracefully?
* Pragmatism
    * Are the above factors balanced well against the limited time to implement the solution?


## Timeline

We've estimated that this question should typically take 4 hours or less.
Please try not to go significantly above that, as we want to be mindful of
your time and other life commitments! 

## Submission

Please zip your entire exercise directory and send it back to us via email.
Feel free, but not required, to create a Git repository for your work, just
remember to include your .git directory in your zip if you do!

Best of luck! Thanks for taking the time to interview with Mailchimp.
