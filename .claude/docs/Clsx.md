TITLE: Basic Usage of clsx with Different Input Types
DESCRIPTION: Demonstrates importing and using clsx with various input types including strings, objects, arrays, and nested combinations. Shows how the library conditionally constructs className strings based on truthy values.
SOURCE: https://github.com/lukeed/clsx/blob/master/readme.md#2025-04-20_snippet_1

LANGUAGE: javascript
CODE:
```
import clsx from 'clsx';
// or
import { clsx } from 'clsx';

// Strings (variadic)
clsx('foo', true && 'bar', 'baz');
//=> 'foo bar baz'

// Objects
clsx({ foo:true, bar:false, baz:isTrue() });
//=> 'foo baz'

// Objects (variadic)
clsx({ foo:true }, { bar:false }, null, { '--foobar':'hello' });
//=> 'foo --foobar'

// Arrays
clsx(['foo', 0, false, 'bar']);
//=> 'foo bar'

// Arrays (variadic)
clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]]);
//=> 'foo bar baz hello there'

// Kitchen sink (with nesting)
clsx('foo', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya');
//=> 'foo bar hello world cya'
```

----------------------------------------

TITLE: Handling Falsey Values with clsx
DESCRIPTION: Shows how clsx handles falsey values and Boolean values. All falsey values and standalone Boolean values are discarded when constructing the className string.
SOURCE: https://github.com/lukeed/clsx/blob/master/readme.md#2025-04-20_snippet_2

LANGUAGE: javascript
CODE:
```
clsx(true, false, '', null, undefined, 0, NaN);
//=> ''
```

----------------------------------------

TITLE: Configuring VS Code for Tailwind CSS with clsx
DESCRIPTION: JSON configuration for Visual Studio Code settings to enable Tailwind CSS class autocompletion when using clsx. Requires installing the Tailwind CSS IntelliSense extension.
SOURCE: https://github.com/lukeed/clsx/blob/master/readme.md#2025-04-20_snippet_4

LANGUAGE: json
CODE:
```
{
 "tailwindCSS.experimental.classRegex": [
   ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"] 
 ]
}
```

----------------------------------------

TITLE: Using clsx/lite for String-Only Arguments
DESCRIPTION: Demonstrates the lightweight version of clsx that only accepts string arguments. This version is 140 bytes gzipped and ignores any non-string inputs, making it ideal for applications that only use the string-builder pattern.
SOURCE: https://github.com/lukeed/clsx/blob/master/readme.md#2025-04-20_snippet_3

LANGUAGE: javascript
CODE:
```
import { clsx } from 'clsx/lite';
// or
import clsx from 'clsx/lite';

// string
clsx('hello', true && 'foo', false && 'bar');
// => "hello foo"

// NOTE: Any non-string input(s) ignored
clsx({ foo: true });
//=> ""
```