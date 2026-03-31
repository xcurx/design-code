##Input
<p>
inputs = {
        "diagram_input": diagram,
        "user_input": user_input,
}
</P>

##XML
<p>
<diagram>
  <classes>
    <class name="Game" type="class">
      <attributes>
        <attribute visibility="-" name="Player" type="list&lt;player&gt;" />
        <attribute visibility="-" name="Board" type="Board" />
        <attribute visibility="-" name="Dice" type="dice" />
      </attributes>
      <methods>
        <method visibility="+" name="StartGame" returnType="void" params="" />
        <method visibility="+" name="PlayTurn" returnType="void" params="" />
        <method visibility="+" name="CheckWin" returnType="void" params="" />
      </methods>
    </class>
    <class name="Dice" type="interface">
      <attributes>
        <attribute visibility="-" name="Roll" type="int" />
      </attributes>
      <methods>
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="inheritance" source="Dice" target="Game" />
  </relationships>
</diagram>
</P>

##User Input
<p>
default_user_input = "Please analyze the following UML class diagram and provide a detailed report on the structural validity, relationship correctness, and design quality of the classes and relationships."
</p>
