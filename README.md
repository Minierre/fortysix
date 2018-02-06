# FortySix

**What it does:**

FortySix is a platform for low-barrier-to-entry machine learning. Advanced users can write criteria which the platform will optimize a solution for using simulated evolution.

**How to use it:**

FortySix's machine learning algorithm is a highly parameterizable genetic algorithm. Users have control over the following environmental parameters:
 - population size
 - chromosome length
 - gene pool
 - fitness goal
 - elitism
 - reproductive coefficient
 - number of generations
 - selection method
 - mutation methods

In addendum to these parameters the admin of a given room, or experiment, can define their own fitness function in javascript

**How it works:**

Genetic algorithms simulated evolution as a method of seaking global optimization points in very large solution spaces. They hinge on fitness function, which can be computationally taxing to iterate large numbers of times. It is therefore uncommon for genetic algorithms to be used in situation where practitioners have limited computing power. Our platform enables a wider audience to experiment with these optimization techniques by offloading the computation of their algorithm to multiple computers via their web browsers. Contributors can donate their computing power and track their contributions to various experiments simply by navigating a website and choosing which experiments they wish to contribute to. This distribution method of the computation is not only efficient but easy for both practitioners and contributors to use.

As a practitioner some key pieces of data are available through the interface. The core of the data visualization from the practitioner’s perspective is a statistical analysis of their genetics algorithm’s success, which is updated in real time. The graph shows the ten most recent generations which have been adequately processed by the nodes in their network (contributors) against a proportionally sized and curated selection of random chromosomes. This enables a practitioner to gauge in real time how their parameterized evolutionary process compared to random guess and check, in a normalized way. This statistical analysis is done using the z-scores of log-transformed fitnesses as measurements. Further optimization is done by discontinuing the calculation and storage of measurements when the standard deviation of the accumulated standard deviations stabilizes.

As a contributor, a user can track their contributions to an experiment with a real time updates of the number of tasks which they have completed for a given experiment, the amount of time which they have been contributing to that task, the percentage of all tasks for the experiment which they are responsible for completing, and their average completed tasks per second. Which reifies the user’s, otherwise abstract, contribution to an experiment.

**Glossary:**

 - chromosome: a series of tokens which are interpretable as a possible solution to an optimization problem
 - solution space: the set of all possible solutions to a problem
 - fitness function: a function which takes a chromosome and outputs a numerical value which is some representation of how optimized that chromosome is in the context of tis solution space
 - population size: number of chromosomes per task
 - chromosome length: number of genes per chromosome
 - gene pool: the set of tokens which all chromosomes are composed of
 - fitness goal: a specific fitness score which will terminate the experiment and output the chromosome which met the fitness goal
 - elitism: a fitness goal which guarantees a given chromosome will survive
 - reproductive coefficient: number of child chromosomes each surviving chromosome from a task generates for the next generation
 - number of generations: number of generations before experiment terminates
 - selection method: method for selecting winning chromosomes
 - mutation methods: methods for generating children chromosomes from selected chromosomes from a given generation

