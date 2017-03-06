# mvn-nyan-reporter
Nyan Cat style test reporter for the MVN Surefire plugin, based on mocha and karma reporters.

![mvn-nyan-success](https://cloud.githubusercontent.com/assets/933621/23616663/86abbaca-0258-11e7-94a2-546c929c05f5.gif)

> This reporter is a port of the Node.js reporter,  [karma-nyan-reporter](https://github.com/dgarlitt/karma-nyan-reporter).

#### Disclaimer
I do not intend to maintain this beyond my own needs, which is why this is not on NPM. If you are interested in becoming the maintainer, please contact me or open an issue in this project.

### Installation
This reporter runs on Node.js, so that's a prerequisite.

```
npm install -g https://github.com/losandes/mvn-nyan-reporter.git
```
### Usage
From your project directory, you can just run it without any arguments:

```
mvn-nyan
```

#### MVN Arguments
If you're already used to using `mvn test` arguments, you can use them here too.

> Currently only `-Dtest` is supported

#### Working Directories
To set the working directory, or to run multiple projects, you can use the `-folders` or `-f` switches. When running multiple tests, they will run synchronously, and each will start with the directory name, as a heading.

```Shell
# run tests in the common project
mvn-nyan -f ./common

# run tests in the common and my-project projects
mvn-nyan -f ./common,./my-project
```

##### Running Directories in Parallel
If you want to run multiple directories at once, use the `-parallel` switch.

```
mvn-nyan -f ./common,./my-project -scaredyCat true -parallel true
```

#### Running a single test
In addition to the built in `mvn` args, there's a short hand for this, using the `-tests` or `-t` switches:

```Shell
# run the tests found in the SomeTestClass
mvn-nyan -t SomeTestClass

# run the someTestMethod test found in the SomeTestClass
mvn-nyan -t SomeTestClass#someTestMethod

# run the tests found in the SomeTestClass and OtherTestClass
mvn-nyan -t SomeTestClass,OtherTestClass
```

> For more info on running tests, including wildcard matchers, see the [maven documentation](http://maven.apache.org/surefire/maven-surefire-plugin/examples/single-test.html)

#### Printing the Logs
To print the logs, after the tests complete, use the `-logs` or `-l` switches.

```Shell
# print all logs
mvn-nyan -l true

# print logs where the word DEBUG exists
mvn-nyan -l DEBUG

# print logs where the words ERROR, or "Total time" exists
mvn-nyan -l ERROR,"Total time"
```

#### Suppressing the Nyan Cat
If you're running this on CI, or in a background process, the nyan cat doesn't delight so much. You can turn it off with the `-scaredyCat` switch.

```Shell
mvn-nyan -scaredyCat true
```

#### Fonts
There are several headings fonts, which you can choose from using the `-font` switch.

```Shell
# subzero is the default (height = 5)
mvn-nyan -font subzero

# none just uses your console font
mvn-nyan -font none

# isometric (height = 11)
mvn-nyan -font isometric

# small-isometric (height = 7)
mvn-nyan -font small-isometric

# 3D-ascii (height = 9)
mvn-nyan -font 3D-ascii
```

> Note that 3D-ascii is the only font that supports numbers

#### Headings
By default, the only headings that are printed are the project heading, when using the `-f` or `-folders` switches, and the Logs heading. You can override some of these behaviors:

```Shell
# Print the statistics heading
mvn-nyan -statsHeading true

# Choose a heading for the statistics
mvn-nyan -statsHeading OUTCOME

# Print the failures heading
mvn-nyan -failuresHeading true

# Choose a heading for the failures
mvn-nyan -failuresHeading ERR

# Don't print the logs heading
mvn-nyan -logsHeading false

# Choose a heading for the logs
mvn-nyan -logsHeading OUTPUT
```
