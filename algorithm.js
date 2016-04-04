function DNF(result){

  // global: state_stack
  var state_stack = [];
  var trace = [];

  var id = 0;

  function next_id(){
    id += 1;
    return id;
  }


  function keep_log(state, parent, operator){
    state.parent_id = parent;
    state.id = next_id();
    var log = JSON.parse(JSON.stringify(state));
    log.operator = operator;
    trace.push(log);
  }

  // init

  var triple = new Object();

  triple.formula_stack = [result];
  triple.variable_array = [];
  triple.negation_flag = [false];
  triple.parent_id = 0;
  triple.id = next_id();

  var init = JSON.parse(JSON.stringify(triple));

  trace.push(init);



  state_stack.push(triple);

  // var trace;


  function A(){
    console.log("A");
    if (state_stack.length == 0){
      return;
    }
    var state = state_stack.pop();
    if (state.formula_stack.length == 0){
      console.log(state.variable_array);
      return A();
    }

    var parent = state.id;


    var formula = state.formula_stack.pop();

    var flag = state.negation_flag.pop();

    // when it is an atom
    if (formula["prop"] != null){

      if (flag == false){
        state.variable_array.push(formula["prop"]);
        keep_log(state, parent, "atom");
        state_stack.push(state);
        return A();
      }
      else{
        state.variable_array.push("!" + formula["prop"]);
        keep_log(state, parent, "atom");
        state_stack.push(state);
        return A();
      }
    }
    else if (formula["neg"] != null){

      state.negation_flag.push(!flag);
      state.formula_stack.push(formula["neg"]);
      keep_log(state, parent, "neg");
      state_stack.push(state);
      return A();

    }
    else if ((flag == false  && (temp = formula[(m = "conj")]) != null) || (flag == true && (temp = formula[(m = "disj")]) != null)){

      state.formula_stack.push(temp[1]);
      state.formula_stack.push(temp[0]);
      state.negation_flag.push(flag);
      state.negation_flag.push(flag);
      keep_log(state, parent, m);
      state_stack.push(state);
      return A();

    }
    else if ((flag == false  && (temp = formula[(m = "disj")]) != null) || (flag == true && (temp = formula[(m = "conj")]) != null)){

      var state2= new Object();
      var flag2 = JSON.parse(JSON.stringify(state.negation_flag));
      flag2.push(flag);
      state2.negation_flag = flag2;
      var stack2 = JSON.parse(JSON.stringify(state.formula_stack));
      stack2.push(temp[1]);
      state2.formula_stack = stack2;
      state2.variable_array = state.variable_array.slice(0);

      var state1 = new Object();
      var flag1 = JSON.parse(JSON.stringify(state.negation_flag));
      flag1.push(flag);
      state1.negation_flag = flag1;
      var stack1 = JSON.parse(JSON.stringify(state.formula_stack));
      stack1.push(temp[0]);
      state1.formula_stack = stack1;
      state1.variable_array = state.variable_array.slice(0);

      keep_log(state2, parent, m);
      keep_log(state1, parent, m);

      state_stack.push(state2);
      state_stack.push(state1);

      return A();
    }
    else {
      console.log("sth wrong");
    }

  }






  A();


  function append_children(name){
    var children = [];
    trace.forEach(function(log){
      if (log.parent_id == name){
        var child = new Object();
        child.name = log.id;
        child.content = log;
        child.children = append_children(child.name);
        children.push(child);
      }
    });
    if (children.length == 0){
      return null;
    }
    else{
      return children;
    }

  }


  var root = new Object();

  root.name = 1;

  root.content = trace[0];

  root.content.operator = "start";

  root.children = append_children(root.name);

  return root;


}























