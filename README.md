# FortySix

**What it does:**

FortySix is a platform that allows users to customize and run genetic algorithms. The computational load of each genetic algorithm running on the platform is distributed across many different web-browser clients, meaning any user can sign up and contribute their computing power.

**How to use it:**

##### 1. Sign up or log in and create your own room by navigating to the rooms tab on the navigation bar and creating a room

   Once an admin of a room, you can customize the following environmental parameters:

   | Parameter | Value | Description |
   |:------------- |:-------------|:-----|
   | population size | integer | the number of chromosomes that makes up a "full" generation (and the amount of chromosomes given to each client to run the fitness function on) |
   | chromosome length | integer | the length of each chromosome in a the population, made up of the genes in the gene pool |
   | gene pool | comma delimited values | the building blocks of each chromosome |
   | fitness goal | integer | a chromosome with this level of fitness will terminate the algorithm and immediately be returned as the result |
   | elitism | integer | if a population contains a chromosome with a fitness level greater than or equal to the elitism score, then we automatically include the strongest chromosome of that population in the next generation, before proceeding to the selection method |
   | reproductive coefficient | the number of children each selected chromosome creates for the next generation | integer |
   | number of generations | an algorithm termination condition |  integer |
   | selection method | determines how the chromosomes from the current population are selected for inclusion in the next generation | dropdown menu |
   | mutation methods | methods of adaptation | table |

##### 2. Invite a few friends to help contribute their computing power to your cause by manually converting your URL into a contributor URL.

   URL Conversion:

   | Admin URL path | Contributor URL path |
   |:----------|:-------------|
   | '/admin/roomHash' | '/contributor/roomHash/' |

##### 3. Navigate to the "run" tab

   Once your contributors are connected, you should see a few green nodes in the run tab and the ability to "run the job"
   
   When you're ready, click "run job"
   
##### 4. Algorithm performance

   In the data view, you'll see a graph which tells you how your algorithm is performing in real time. The graph shows the ten most recent    generations which have been adequately processed by the nodes in their network (contributors) against a proportionally sized and          curated selection of random chromosomes. The view updates every 5 seconds.
   
   The x axis is divided into 5 categories - each category represents a z-score bucket that tells the practitioner if their algorithm is      performing *better* than random. For example, a genetic algorithm with no parameters should report a graph with a very high density in    the "random" category because it should theoretically not be performing better than random. The z-scores reported are calculated          through a log-transformation of fitness data and measured against random guess-and-check.

**How it works:**

Genetic algorithms simulate evolution as a method of seaking global optimization points in very large solution spaces. They hinge on a specific fitness function, which is run on hundreds of thousands of different chromosomes to evaluate their suitability as potential solutions in the entire space. However, genetic algorithms are computationally expensive, which creates a barrier to entry for people with limited computing power. Our platform enables a wider audience to experiment with genetic algorithms by offloading the computation of their fitness function to multiple computers via their web browsers. On top of that, each client uses web-workers to enable multithreading, which segments task processing down even further and gives a performance boost. 

Contributors can donate their computing power and track their contributions to various experiments simply by navigating to our website and choosing which experiments they wish to contribute to. This distribution method of the computation is not only efficient but easy for both practitioners and contributors to use.

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

