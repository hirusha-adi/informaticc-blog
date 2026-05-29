# Dunder Functions in Python

- Dunder methods, or "double underscore" methods, are special methods in Python classes.
- These methods are identified by names enclosed within double underscores, such as **init** and **str**.
- Dunder methods provide hooks to customize fundamental operations for objects, including initialization, string representation, and arithmetic operations.
- Leveraging dunder methods enhances code expressiveness and flexibility in creating more intuitive and powerful Python classes.
- Lets discuss some of the main dunder methods for classes in Python.

## 1. [`__init__`](#constructor-__init__)

- Already discussed. [Click here](./oop-concepts-nodes.md) to open that note.

## 2. `__str__`

- String Representation Method
- The `__str__` method is called by the `str()` function and `print()` to get a human-readable string representation.

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f"{self.name}, {self.age} years old"

# Using the __str__ method
print(str(Person(name="John", age=25)))
# Output: John, 25 years old
```

## 3. `__repr__`

- Unambiguous Representation Method
- The `__repr__` method is called by the `repr()` function and is used for a more detailed, unambiguous representation, often for debugging.

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __repr__(self):
        return f"Person(name={self.name}, age={self.age})"

# Using the __repr__ method
print(repr(Person(name="John", age=25)))
# Output: Person(name=John, age=25)
```

## 4. `__len__`

- Length Method
- The `__len__` method is called by the built-in `len()` function. It should return the length of the object.

```python
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def __len__(self):
        return len(self.items)

# Using the __len__ method
stack = Stack()
stack.push(1)
stack.push(2)
print(len(stack))
# Output: 2
```

## 5. `__getitem__`

- Item Access Method
- The `__getitem__` method is called to retrieve the value at a specific index using square bracket notation.

```python
class MyList:
    def __init__(self, data):
        self.data = data

    def __getitem__(self, index):
        return self.data[index]

# Using the __getitem__ method
my_list = MyList([1, 2, 3, 4, 5])
print(my_list[2])
# Output: 3
```

## 6. `__del__`

- Destructor Method
- The `__del__` method is called when an object is about to be destroyed. It can be used for cleanup activities.

```python
class MyClass:
    def __del__(self):
        print("Object deleted")

# Object instantiation
obj = MyClass()

# Object deletion
del obj  # Output: Object deleted
```

## 7. `__call__`

- Call Method
- The `__call__` method allows an object to be called as a function.

```python
class CallableClass:
    def __call__(self, x):
        return x * 2

# Object instantiation
obj = CallableClass()

# Using the __call__ method
result = obj(5)
print(result)
# Output: 10
```

## 8. `__iter__` and `__next__`

- Iterable Protocol
- Implementing `__iter__` and `__next__` allows an object to be an iterable, supporting iteration using `for` loops.

```python
class Counter:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current < self.limit:
            self.current += 1
            return self.current - 1
        else:
            raise StopIteration

# Using the iterable
counter = Counter(limit=5)
for num in counter:
    print(num)
# Output: 0 1 2 3 4
```

## 9. `__eq__` and `__ne__`

- Equality Methods
- The `__eq__` and `__ne__` methods allow you to customize the behavior of equality and inequality comparisons.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __ne__(self, other):
        return not self.__eq__(other)

# Object instantiation
point1 = Point(1, 2)
point2 = Point(1, 2)

# Using the equality methods
print(point1 == point2)  # Output: True
print(point1 != point2)  # Output: False
```

## 10. `__add__`

- Addition Method
- The `__add__` method allows objects of a class to define the behavior of the `+` operator.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

# Object instantiation
point1 = Point(1, 2)
point2 = Point(3, 4)

# Using the __add__ method
result = point1 + point2
print(result.x, result.y)
# Output: 4 6
```

## 11. `__sub__`

- Subtraction Method
- The `__sub__` method defines the behavior of the `-` operator for objects of a class.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __sub__(self, other):
        return Point(self.x - other.x, self.y - other.y)

# Object instantiation
point1 = Point(5, 8)
point2 = Point(2, 3)

# Using the __sub__ method
result = point1 - point2
print(result.x, result.y)
# Output: 3 5
```

## 13. `__contains__`

- Membership Test
- The `__contains__` method defines the behavior of the `in` operator for objects of a class.

```python
class ShoppingCart:
    def __init__(self, items):
        self.items = items

    def __contains__(self, item):
        return item in self.items

# Object instantiation
cart = ShoppingCart(["apple", "banana", "orange"])

# Using the __contains__ method
print("banana" in cart)  # Output: True
print("grapes" in cart)  # Output: False
```

## Others

- Yes, there are more!
- [Click here](https://docs.python.org/3/reference/datamodel.html#special-method-names) to open the official documentation.
