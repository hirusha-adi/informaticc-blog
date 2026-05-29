# Object-Oriented Programming (OOP) Concepts with Python


## 1. Inheritance

- https://www.youtube.com/embed/an59YHkdK9A?si=RrERAdfk4VByvnYq
- https://www.youtube.com/embed/J2_DHndMW9s?si=8IopBW9_zEiq3JtI
- https://www.youtube.com/embed/mRIeUXhIAxg?si=6imvSrskMKwPMAS0

- Allows a class (subclass/derived class) to inherit properties and behaviors from another class (superclass/base class).
- This promotes code reusability and helps in organizing and structuring code effectively.

### Basic Inheritance

#### Creating a Base Class

Let's start by creating a simple base class:

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(f"{self.name} makes a sound.")
```

#### Creating a Derived Class

Now, let's create a derived class that inherits from the `Animal` class:

```python
class Dog(Animal):
    def bark(self):
        print(f"{self.name} barks loudly!")

# Creating an instance of the derived class
dog_instance = Dog("Buddy")

# Accessing the base class method
dog_instance.speak()  # Output: Buddy makes a sound.

# Calling the method defined in the derived class
dog_instance.bark()   # Output: Buddy barks loudly!
```

In this example, `Dog` is a subclass of `Animal`, and it inherits the `__init__` and `speak` methods from the base class.

### Method Overriding

Subclasses can override methods inherited from the base class by providing their own implementation.

```python
class Cat(Animal):
    def speak(self):
        print(f"{self.name} meows softly.")

# Creating an instance of the derived class
cat_instance = Cat("Whiskers")

# Overriding the speak method
cat_instance.speak()  # Output: Whiskers meows softly.
```

Here, the `speak` method in the `Cat` class overrides the method in the `Animal` class.

### Using `super()` to Invoke the Parent Class

The `super()` function is used to call methods and constructors of the parent class. Let's illustrate this with an example:

```python
class Bird(Animal):
    def __init__(self, name, wingspan):
        super().__init__(name)
        self.wingspan = wingspan

    def fly(self):
        print(f"{self.name} is flying with a wingspan of {self.wingspan} inches.")

# Creating an instance of the derived class
bird_instance = Bird("Robin", 10)

# Accessing the base class method using super()
bird_instance.speak()  # Output: Robin makes a sound.

# Accessing the overridden method in the derived class
bird_instance.fly()    # Output: Robin is flying with a wingspan of 10 inches.
```

In this example, `super().__init__(name)` is used to invoke the constructor of the base class (`Animal`) and initialize the `name` attribute.

## 2. Encapsulation

<iframe width="560" height="315" src="https://www.youtube.com/embed/dzmYoSzL8ok?si=MOqUZHwsTROOTQZW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

- Involves bundling data and methods that operate on the data into a single unit known as a class.
- It helps in restricting access to certain components of the object and preventing unintended interference, providing data integrity and security.

### Basic Encapsulation

#### Creating a Class with Private Attributes

Let's start by creating a class with private attributes:

```python
class BankAccount:
    def __init__(self, account_number, balance):
        self.__account_number = account_number  # Private attribute
        self.__balance = balance                # Private attribute

    def get_balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"Deposited ${amount}. New balance: ${self.__balance}")
        else:
            print("Invalid deposit amount.")

    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            print(f"Withdrew ${amount}. New balance: ${self.__balance}")
        else:
            print("Invalid withdrawal amount.")
```

In this example, `__account_number` and `__balance` are private attributes.

#### Accessing Private Attributes

Now, let's use the class and access its methods:

```python
# Creating an instance of the class
account = BankAccount("123456", 1000)

# Accessing a public method
current_balance = account.get_balance()
print(f"Current balance: ${current_balance}")

# Accessing private attributes indirectly through methods
account.deposit(500)  # Output: Deposited $500. New balance: $1500
account.withdraw(200)  # Output: Withdrew $200. New balance: $1300
```

In this example, private attributes are accessed and modified through public methods, providing encapsulation.

### Properties

A property is a special feature that allows you to control access to the attributes or fields of a class.

It provides a way to get, set, or delete the value of an attribute while allowing additional logic to be executed.

Consider the following example **without** using properties:

```python
class Dog:
    def __init__(self):
        self.__age = None

    def get_age(self):
        return self.__age

    def set_age(self, age):
        if age > 0:
            self.__age = age

obj = Dog()
obj.set_age(15) # we run methods in this class

# wouldn't it be easier if we could:
# obj.age = 15 # but with all the checks?
```

In the above code, you would need to call methods manually to set values for private variables. However, in Python, you can leverage properties with getters and setters to simplify this process.

### Getters & Setters

Getters and setters are methods used to control access to the attributes of a class, making them an essential part of encapsulation.

They allow you to:

- enforce read and write access restrictions,
- apply validation logic,
- and maintain the integrity of the class's data.

In Python, you can use the `@property` decorator for the getter method and the `@<property_name>.setter` decorator for the setter method.

### Getters

- The getter method is responsible for getting the value of a property.
- In Python, you can use the `@property` decorator to define a method as a getter.
- It allows you to access the property using the syntax `object.property`.

- Key Points:
  - _Encapsulation Aspect_: By using a getter method, you can provide controlled access to the value of an attribute without exposing the attribute directly.
  - _Data Protection_: Getter methods allow you to enforce read-only access or perform additional logic before returning the attribute value.

```python
class MyClass:
    def __init__(self):
        self._my_property = 42  # A private attribute

    @property
    def my_property(self):
        return self._my_property

obj = MyClass()
print(obj.my_property)  # Accessing the property
```

### Setters

- The setter method is responsible for setting the value of a property.
- In Python, you can use the `@<property_name>.setter` decorator to define a method as a setter.
- It allows you to modify the property using the syntax `object.property = new_value`.

- Key Points
  - _Encapsulation Aspect_: Setter methods allow you to control the modification of attribute values, adding a layer of abstraction to the internal workings of the class.
  - _Data Protection_: Setter methods enable you to validate incoming values, ensuring that only valid data is assigned to the attributes.

```python
class MyClass:
    def __init__(self):
        self._my_property = 42  # A private attribute

    @property
    def my_property(self):
        return self._my_property

    @my_property.setter
    def my_property(self, new_value):
        if new_value >= 0:
            self._my_property = new_value
        else:
            print("Invalid value. Must be non-negative.")

obj = MyClass()
obj.my_property = 99  # Modifying the property
```

## 3. Abstraction

- https://www.youtube.com/embed/TeDlx2Klij0?si=92anMGNwvy8foCmS

- Involves simplifying complex systems by modeling classes based on essential features and hiding unnecessary details.
- It allows developers to focus on relevant aspects while hiding implementation complexities.

### Abstract Classes and Methods

### Creating an Abstract Class

An abstract class in Python is a class that cannot be instantiated and is meant to be subclassed.

It may contain abstract methods, which are declared but do not provide an implementation in the abstract class itself.

Abstract classes are created using the `ABC` (Abstract Base Class) module.

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass
```

In this example, `Shape` is an abstract class with abstract methods `area` and `perimeter`. Any concrete class inheriting from `Shape` must implement these methods.

### Creating Concrete Classes

Concrete classes inherit from abstract classes and provide concrete implementations for abstract methods.

Note: every abstraction method should be overridden

```python
class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14 * self.radius * self.radius

    def perimeter(self):
        return 2 * 3.14 * self.radius

class Rectangle(Shape):
    def __init__(self, length, width):
        self.length = length
        self.width = width

    def area(self):
        return self.length * self.width

    def perimeter(self):
        return 2 * (self.length + self.width)
```

Here, `Circle` and `Rectangle` are concrete classes that inherit from the abstract class Shape and provide implementations for the `area` and `perimeter` methods.

### Using Abstraction in Code

Now, let's use the abstract classes and concrete implementations:

```python
# Creating instances of concrete classes
circle_instance = Circle(5)
rectangle_instance = Rectangle(4, 6)

# Accessing methods through abstraction
print("Circle Area:", circle_instance.area())         # Output: Circle Area: 78.5
print("Circle Perimeter:", circle_instance.perimeter()) # Output: Circle Perimeter: 31.400000000000002

print("Rectangle Area:", rectangle_instance.area())           # Output: Rectangle Area: 24
print("Rectangle Perimeter:", rectangle_instance.perimeter()) # Output: Rectangle Perimeter: 20
```

By utilizing abstraction, we focus on the essential aspects of shapes (area and perimeter) without worrying about the specific implementation details of each shape.

## 4. Polymorphism

- Allows objects of different classes to be treated as objects of a common base class.
- It enables flexibility and adaptability in code by providing a consistent interface for diverse objects.
- In Python, polymorphism is achieved through method overloading and method overriding.

<details>
<summary>Polymorphism with Java</summary>

In Java, polymorphism is achieved through method overloading, method overriding, and **interfaces**.

https://www.youtube.com/embed/jhDUxynEQRI?si=4eVz2ObqAgtAIdp9

#### 1. Method Overloading

#### Defining Multiple Methods with the Same Name

Method overloading in Java involves defining multiple methods in the same class with the same name but different parameter lists. The correct method is chosen at compile-time based on the method signature.

```java
public class MathOperations {
    public int add(int x, int y) {
        return x + y;
    }

    public double add(double x, double y) {
        return x + y;
    }
}
```

In this example, the `add` method is overloaded with two different parameter lists—one for integers and another for doubles.

#### Using Method Overloading

```java
MathOperations mathOps = new MathOperations();

int resultInt = mathOps.add(3, 5);
System.out.println("Result with integers: " + resultInt);  // Output: Result with integers: 8

double resultDouble = mathOps.add(3.5, 2.5);
System.out.println("Result with doubles: " + resultDouble);  // Output: Result with doubles: 6.0
```

The appropriate `add` method is selected at compile-time based on the argument types, demonstrating polymorphic behavior.

#### 2. Method Overriding

#### Redefining Methods in Subclasses

Method overriding in Java involves redefining a method in a subclass that is already defined in its superclass. The overridden method in the subclass provides a specific implementation.

```java
public class Animal {
    public void speak() {
        System.out.println("Animal makes a sound.");
    }
}

public class Dog extends Animal {
    @Override
    public void speak() {
        System.out.println("Dog barks loudly!");
    }
}

public class Cat extends Animal {
    @Override
    public void speak() {
        System.out.println("Cat meows softly!");
    }
```

In this example, the `speak` method is overridden in the `Dog` and `Cat` subclasses, providing specific implementations for each.

#### Using Method Overriding

```java
Animal dog = new Dog();
Animal cat = new Cat();

dog.speak();  // Output: Dog barks loudly!
cat.speak();  // Output: Cat meows softly!
```

Here, the `speak` method of the base class `Animal` is overridden in the derived classes `Dog` and `Cat`, demonstrating polymorphic behavior based on the actual type of the objects.

#### 3. Interfaces

#### Defining Common Interfaces

Java interfaces provide a way to achieve polymorphism by defining common interfaces that classes can implement. This allows objects of different classes to be treated uniformly.

```java
public interface Shape {
    double area();
    double perimeter();
}
```

Here, the `Shape` interface declares methods for calculating the area and perimeter.

#### Implementing Interfaces

Classes can implement the interface, providing concrete implementations for the declared methods.

```java
public class Circle implements Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public double perimeter() {
        return 2 * Math.PI * radius;
    }
}
```

In this example, the `Circle` class implements the `Shape` interface, providing specific implementations for the `area` and `perimeter` methods.

#### Using Interfaces for Polymorphism

```java
Shape circle = new Circle(5.0);

System.out.println("Circle Area: " + circle.area());        // Output: Circle Area: 78.53981633974483
System.out.println("Circle Perimeter: " + circle.perimeter());// Output: Circle Perimeter: 31.41592653589793
```

By treating a `Circle` object as a `Shape` object, we achieve polymorphism through interface implementation.

</details>

### Method Overloading

#### Defining Multiple Methods with the Same Name

This involves defining multiple methods with the same name in a class, but with different parameter lists. The appropriate method is selected at runtime based on the number or types of arguments passed.

```python
class MathOperations:
    def add(self, x, y):
        return x + y

    def add(self, x, y, z):
        return x + y + z
```

In this example, the `add` method is overloaded with two different parameter lists. The correct version of the method is chosen based on the number of arguments provided.

#### Using Method Overloading

```python
math_ops = MathOperations()

result_2_args = math_ops.add(3, 5)
print("Result with 2 args:", result_2_args)  # Output: Result with 2 args: 8

result_3_args = math_ops.add(3, 5, 7)
print("Result with 3 args:", result_3_args)  # Output: Result with 3 args: 15
```

In this usage, the appropriate `add` method is invoked based on the number of arguments provided.

### Method Overriding

#### Redefining Methods in Subclasses

Method overriding involves redefining a method in a subclass that is already defined in its superclass. The overridden method provides a specific implementation in the subclass.

```python
class Animal:
    def speak(self):
        print("Animal makes a sound.")

class Dog(Animal):
    def speak(self):
        print("Dog barks loudly!")

class Cat(Animal):
    def speak(self):
        print("Cat meows softly!")
```

In this example, the `speak` method is overridden in the Dog and Cat subclasses, providing specific implementations for each.

#### Using Method Overriding

```python
dog_instance = Dog()
cat_instance = Cat()

dog_instance.speak()  # Output: Dog barks loudly!
cat_instance.speak()  # Output: Cat meows softly!
```

Here, the `speak` method of the base class `Animal` is overridden in the derived classes `Dog` and `Cat`, allowing for polymorphic behavior based on the object's actual type.

## More about `super()`

- https://www.youtube.com/embed/MBbVq_FIYDA?si=ZflR8G3wBnBx6llw

- You can use the super() function to call a method in the parent class, even if the child class has overridden that method.

```python
class Parent:
    def speak(self):
        print("Parent class speaks.")

class Child(Parent):
    def speak(self):
        # Calling the speak method of the parent class using super()
        super().speak()
        print("Child class speaks too.")

# Creating an instance of the child class
child_instance = Child()

# Calling the speak method of the child class
child_instance.speak()
```

In this example, the `Child` class inherits from the `Parent` class, and both classes have a method named `speak`. Inside the speak method of the `Child` class, `super().speak()` is used to invoke the `speak` method of the parent class.

When you run this code, the output will be:

```
Parent class speaks.
Child class speaks too.
```

This demonstrates how `super()` can be used to call the method in the parent class, allowing you to extend or override functionality while still utilizing the behavior from the parent class.
