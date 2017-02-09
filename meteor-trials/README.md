## Meteor Applications for Trial

### Note on setup on Windows

Following error occurred

_While processing files with ecmascript (for target web.browser): module.js:338:15: Cannot find module 'babel-helper-function-name'_

Error resolved after removing `ecmascript` in `C:\Users\bernie.kim\AppData\Local\.meteor\packages\ecmascript` and reruning

### Extra notes

+ For session
    - `meteor add session`
+ For authentication
    - `meteor add accounts-password`
    - `meteor add accounts-ui`
+ For security
    - `meteor remove autopublish` - _select_ should be made by _publish_ and _subscribe_
    - `meteor remove insecure` - _insert_, _update_ and _remove_ should be made by methods
    - `meteor add check` for validation
+ For routing
    - `meteor add iron:router`
    - Flow Router is also an option

### Visualization
+ nvd3.js - `meteor add nvd3:nvd3` (**official**)
    - works with and without meteor package
    - for without meteor package
        * `meteor add d3js:d3` and put js and css to _/client_ folder
    - without meteor package would be better as examples in the project website can be used more directly
+ dimple.js
    - `meteor add sergeyt:dimple`
    - reference error of _dimple_ with and without meteor package
+ chart.js
    - `meteor add chart:chart` (**official**)
+ dygraphs
    - put _dygraph-combined.js_ in _client/compatibility_ folder [source](http://stackoverflow.com/questions/34014696/dygraph-not-defined-in-meteorjs-client-side)
+ highcharts, amcharts and plotly are not considered due to licence issue or lack of support

### Meteor POC
+ Session - `meteor add session`
+ noUiSlider - `meteor add rcy:nouislider`
+ TwitterBootstrap - `meteor add twbs:bootstrap`

#### Progress
+ Jul 6, 2016
    - Reactive chart rendering done (see */app-trials/meteor-poc-nvd3-cp*)
    - On slider change, an R script (*example.R*) is executed and the output is saved to *DataSets* (Mongo collection)
    - An observer is binded to *DataSet* and, when data is added, the chart is rendered again with new data
    - Compared to Shiny where a R process is kept binded, it takes longer to update the chart. However, as the R script is executed asynchronously, there is a potential that it is not blocking although multiple users execute it at the same time.
+ Jul 5, 2016
    - R script can be run as a child process, saving its output to a Mongo collection
+ Jul 4, 2016
    - **nvd3** and **dygraphs** are actively looked into
    - `meteor add session rcy:nouislider twbs:bootstrap d3js:d3`
    - add client libraries of nvd3 and dygraphs to */client/compatibility/lib-name*
+ Jul 3, 2016
    - slider working with nouislider, chart example with chart.js

### Other useful packages
+ Moment: `meteor add momentjs:moment`