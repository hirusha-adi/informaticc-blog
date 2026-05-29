# Object-Oriented Programming (OOP) Notes with Python


## Introduction

- If you are looking for OOP Concepts only, [click here](./oop-concepts-python)

- Great video that covers the majority of theory: https://www.youtube.com/embed/Ej_02ICOIgs?si=-cAUyirCZyj9VUPu

- Let's illustrate the difference between a functional approach using global variables and an object-oriented approach in Python

### Functional Approach

```python
# Functional approach with global variables
global_data = []

def add_data(value):
    global global_data
    global_data.append(value)

def process_data():
    global global_data
    for item in global_data:
        print(f"Processing data: {item}")

# Using the functions with a single dataset
add_data(10)
add_data(20)
process_data()
```

In this example, `global_data` is a global variable that functions (`add_data` and `process_data`) operate on. This approach can become problematic when dealing with multiple datasets, as they all share the same global space.

### Object-Oridented Approach

Don't worry if you don't understand the code below, we will be looking at everything in detail later.

```python
# Object-oriented approach
class Dataset:
    def __init__(self):
        self.data = []

    def add_data(self, value):
        self.data.append(value)

    def process_data(self):
        for item in self.data:
            print(f"Processing data: {item}")

# Using the class with multiple datasets
dataset1 = Dataset()
dataset1.add_data(10)
dataset1.add_data(20)
dataset1.process_data()

dataset2 = Dataset()
dataset2.add_data(30)
dataset2.add_data(40)
dataset2.process_data()
```

In this object-oriented example, the `Dataset` class encapsulates the data and behavior related to a dataset. Instances (`dataset1` and `dataset2`) maintain their own state, avoiding global conflicts. This makes it easier to manage multiple datasets, as each instance operates independently.

## What is OOP?

Object-oriented programming is a programming paradigm that provides a means of structuring programs so that properties and behaviors are bundled into individual **objects**.

For example, an object could represent a person with **properties** like a name, age, and address and **behaviors** such as walking, talking, breathing, and running. Or it could represent an email with properties like a recipient list, subject, and body and behaviors like adding attachments and sending.

Put another way, object-oriented programming is an approach for modeling concrete, real-world things, like cars, as well as relations between things, like companies and employees or students and teachers. OOP models real-world entities as software objects that have some data associated with them and can perform certain operations.

The key takeaway is that objects are at the center of object-oriented programming in Python.

## Defining a class

You start all class definitions with the class keyword, then add the name of the class and a colon. Python will consider any code that you indent below the class definition as part of the class’s body.

Here’s an example of a Dog class:

```python
class Dog:
    pass
```

:::note note
The body of the Dog class consists of a single statement: the `pass` keyword. Python programmers often use pass as a placeholder indicating where code will eventually go. It allows you to run this code without Python throwing an error.
:::

:::info note
Python class names are written in [`CapitalizedWords` notation](https://en.wikipedia.org/wiki/Camel_case#Variations_and_synonyms) by convention. For example, a class for a specific breed of dog, like the Jack Russell Terrier, would be written as JackRussellTerrier.
:::

## Instantiating an Object

Object instantiation is the process of creating an instance of a class. When you define a class, you're essentially creating a blueprint for objects.

- Example:

  ```python
  # Creating an instance of the Dog class
  my_dog = Dog()
  ```

In this example:

- `my_dog` is assigned as the identifier for the new object.
- `my_dog` represents an instance of the `Dog()` class, embodying the attributes and behaviors specified within the class definition.

### Constructor (`__init__`)

- When an object is being instantiated, the constructor is automatically and immediately executed (called 'Automatic Invocation').
- The constructor is defined using the `__init__()` method (basically a function) within the class.

- Example:

  ```python
  # Class definition
  # -------------------------------
  class Dog:
      def __init__(self):
          print("Object Instantiated")

  # Object instantiation
  # -------------------------------
  my_dog = Dog()
  ```

  In this example, as soon as `my_dog` is created, the constructor `__init__()` is triggered, resulting in the console output of `"Object Instantiated"`.

:::note `self` argument
In this code, `self` is a reference to the instance of the `Dog` class. It allows the instance to access and modify its own attributes and methods. In the `__init__` method, `self` represents the instance being created, and it is automatically passed when the method is called during object instantiation.
:::

- Example:

  ```python
  # Class definition
  # -------------------------------
  class Dog:
      # Class attribute
      species = "Canis familiaris"

      # Constructor with custom variables
      def __init__(self, name, age):
          self.name = name  # Instance attribute
          self.age = age    # Instance attribute
          print("Dog object created")

      # Instance method
      def bark(self):
          print(f"{self.name} says Woof!")

      # Another instance method using the bark method
      def celebrate_birthday(self):
          self.age += 1
          self.bark() # note the self.method_name() syntax here, just like for attributes
          print(f"{self.name} is now {self.age} years old!")

  # Object instantiation with custom variables
  # -------------------------------
  my_dog = Dog(name="Buddy", age=3) # note that we don't pass in anything for self
                                    # as its handled automatically
                                    # we pass in values for __init__ function (constructor)

  # Using instance methods
  my_dog.celebrate_birthday()

  # Accessing class attribute
  print(f"All dogs belong to the species: {Dog.species}")
  ```

In this updated code:

- `name` and `age` are custom variables passed to the `__init__` method. These become instance attributes (`self.name` and `self.age`) when the object is instantiated.

- `species` is a class attribute shared among all instances of the `Dog` class.

- `bark` is an instance method that can access instance attributes using `self`.

:::info learn more

Read [**Python Class Constructors: Control Your Object Instantiation by Leodanis Pozo Ramos**](https://realpython.com/python-class-constructor/) for additional information.

:::

- Example: continuing the above example,

```python
my_dog = Dog() # this would raise an error

# Traceback (most recent call last):
#   ...
# TypeError: __init__() missing 2 required positional arguments: 'name' and 'age'
```

### Class Variables vs Instance Variables

**Class Attributes:**

- Shared among all instances.
- Defined outside methods within the class.
- Accessed and modified using the class name.

**Instance Attributes:**

- Unique to each instance.
- Defined within methods using `self`.
- Accessed and modified using the instance name.

| Aspect             | Class Attributes                                                                   | Instance Attributes                                                            |
| ------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Scope**          | Belong to the class and are shared among all instances.                            | Belong to individual instances and are unique to each object.                  |
| **Declaration**    | Defined outside methods within the class.                                          | Defined within methods using `self` keyword.                                   |
| **Modification**   | Modified by accessing through the class name. Changes affect all instances.        | Modified by accessing through the instance. Changes affect only that instance. |
| **Initialization** | Often set during class definition or within class methods outside the constructor. | Set within the class constructor (`__init__`) using `self`.                    |
| **Access**         | Accessed using the class name. (e.g., `Classname.attribute`)                       | Accessed using the instance name. (e.g., `instance_name.attribute`)            |

### Variable Scopes

#### **Normal Variables:**

- Declared without any prefix.
- Accessible both within the class and externally.
- Follow conventional naming standards but are not enforced.

```python
class Car:
    def __init__(self, model, year):
        self.model = model  # Normal variable
        self.year = year    # Normal variable

my_car = Car(model="Sedan", year=2022)
print(f"Model: {my_car.model}, Year: {my_car.year}")
```

#### **Private Variables:**

- Declared with a double underscore prefix (`__`).
  - Private variables, marked with a double underscore, enhance encapsulation (let's discuss this later) by restricting direct access from outside the class. This helps maintain data integrity and control access to sensitive information.
- Intended to be accessed and modified only within the class.
- Provides encapsulation and data hiding.

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private variable

    def deposit(self, amount):
        self.__balance += amount

    def get_balance(self):
        return self.__balance

# Using private variable
account = BankAccount(balance=1000)
account.deposit(500)
print(f"Current Balance: {account.get_balance()}")
```

## Methods

| Feature                       | Class Methods                                                                                                                                               | Static Methods                                                                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decorator**                 | `@classmethod`                                                                                                                                              | `@staticmethod`                                                                                                                             |
| **First Parameter**           | Takes the class (`cls`) as the first parameter.                                                                                                             | Does not take a reference to the class or instance.                                                                                         |
| **Access to Class Variables** | Can access and modify class-level variables.                                                                                                                | Cannot access or modify class-level variables directly.                                                                                     |
| **Use Cases**                 | Used for operations related to the class and may involve class-level data. Often used for alternative constructors, working with class-specific attributes. | Used when the method is related to the class but doesn't depend on class-level data. Typically used for utility functions within the class. |

### Class Methods

- Class methods are defined using the `@classmethod` decorator.
- They take the class itself as the first parameter (self)
- Class methods can be used for operations that are related to the class and not dependent on instance-specific data.

```python
class MyClass:
    class_variable = 10

    @classmethod
    def class_method(self, x):
        return self.class_variable * x

# Creating an instance of MyClass
my_instance = MyClass()

# Using the class method with the instantiated object
result = my_instance.class_method(5)
print(result)  # Output: 50
```

### Static Methods

- Static methods are defined using the `@staticmethod` decorator.
- They do not take a reference to the class or instance as their first parameter.
- Static methods are typically used when the method does not depend on class or instance-specific data

```python
class MathOperations:
    @staticmethod
    def add(a, b):
        return a + b

# Using the static method without creating an instance
result = MathOperations.add(3, 7)
print(result)  # Output: 10
```

### Dunder Methods

NOTE: This part is **NOT** in the syllabus, but it's great to know.

[**Click here**](./oop-concepts-nodes.md) to learn more

## OOP Concepts

- [**Click here** to open the note](./oop-concepts-python)

NOTE:  This is **important**! Click the above text to open the note.

<br/>
<br/>

---

**References**

- ["Object-Oriented Programming (OOP) in Python 3" by David Amos (realpython.com)](https://realpython.com/python3-object-oriented-programming/)
