# Test XML Solutions

Copy-paste these XML diagrams into the **Import XML** dialog on any problem's solve page to quickly populate the canvas for testing.

---

## 1. Parking Lot System (MEDIUM)

```xml
<diagram>
  <classes>
    <class name="ParkingLot" type="class">
      <attributes>
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="address" type="String" />
        <attribute visibility="-" name="floors" type="List&lt;ParkingFloor&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="addFloor" returnType="void" params="floor: ParkingFloor" />
        <method visibility="+" name="findAvailableSpot" returnType="ParkingSpot" params="vehicleType: VehicleType" />
        <method visibility="+" name="getAvailableSpotCount" returnType="int" params="" />
      </methods>
    </class>
    <class name="ParkingFloor" type="class">
      <attributes>
        <attribute visibility="-" name="floorNumber" type="int" />
        <attribute visibility="-" name="spots" type="List&lt;ParkingSpot&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="getAvailableSpots" returnType="List&lt;ParkingSpot&gt;" params="" />
        <method visibility="+" name="addSpot" returnType="void" params="spot: ParkingSpot" />
      </methods>
    </class>
    <class name="ParkingSpot" type="class">
      <attributes>
        <attribute visibility="-" name="spotId" type="String" />
        <attribute visibility="-" name="spotSize" type="SpotSize" />
        <attribute visibility="-" name="isOccupied" type="boolean" />
        <attribute visibility="-" name="vehicle" type="Vehicle" />
      </attributes>
      <methods>
        <method visibility="+" name="assignVehicle" returnType="boolean" params="vehicle: Vehicle" />
        <method visibility="+" name="removeVehicle" returnType="Vehicle" params="" />
        <method visibility="+" name="canFit" returnType="boolean" params="vehicle: Vehicle" />
      </methods>
    </class>
    <class name="Vehicle" type="abstract">
      <attributes>
        <attribute visibility="#" name="licensePlate" type="String" />
        <attribute visibility="#" name="vehicleType" type="VehicleType" />
      </attributes>
      <methods>
        <method visibility="+" name="getType" returnType="VehicleType" params="" />
      </methods>
    </class>
    <class name="Car" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="getType" returnType="VehicleType" params="" />
      </methods>
    </class>
    <class name="Truck" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="getType" returnType="VehicleType" params="" />
      </methods>
    </class>
    <class name="Motorcycle" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="getType" returnType="VehicleType" params="" />
      </methods>
    </class>
    <class name="Ticket" type="class">
      <attributes>
        <attribute visibility="-" name="ticketId" type="String" />
        <attribute visibility="-" name="entryTime" type="DateTime" />
        <attribute visibility="-" name="exitTime" type="DateTime" />
        <attribute visibility="-" name="vehicle" type="Vehicle" />
        <attribute visibility="-" name="spot" type="ParkingSpot" />
      </attributes>
      <methods>
        <method visibility="+" name="calculateFee" returnType="double" params="" />
      </methods>
    </class>
    <class name="Payment" type="interface">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="processPayment" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="CreditCardPayment" type="class">
      <attributes>
        <attribute visibility="-" name="cardNumber" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="processPayment" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="CashPayment" type="class">
      <attributes>
        <attribute visibility="-" name="cashTendered" type="double" />
      </attributes>
      <methods>
        <method visibility="+" name="processPayment" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="EntryPanel" type="class">
      <attributes>
        <attribute visibility="-" name="panelId" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="issueTicket" returnType="Ticket" params="vehicle: Vehicle" />
      </methods>
    </class>
    <class name="ExitPanel" type="class">
      <attributes>
        <attribute visibility="-" name="panelId" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="processExit" returnType="void" params="ticket: Ticket, payment: Payment" />
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="composition" source="ParkingLot" target="ParkingFloor" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="composition" source="ParkingFloor" target="ParkingSpot" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="inheritance" source="Car" target="Vehicle" />
    <relationship type="inheritance" source="Truck" target="Vehicle" />
    <relationship type="inheritance" source="Motorcycle" target="Vehicle" />
    <relationship type="association" source="ParkingSpot" target="Vehicle" sourceMultiplicity="1" targetMultiplicity="0..1" />
    <relationship type="association" source="Ticket" target="Vehicle" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="inheritance" source="CreditCardPayment" target="Payment" />
    <relationship type="inheritance" source="CashPayment" target="Payment" />
    <relationship type="association" source="EntryPanel" target="ParkingLot" />
    <relationship type="association" source="ExitPanel" target="ParkingLot" />
  </relationships>
</diagram>
```

---

## 2. Library Management System (EASY)

```xml
<diagram>
  <classes>
    <class name="Library" type="class">
      <attributes>
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="address" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="getBooks" returnType="List&lt;Book&gt;" params="" />
      </methods>
    </class>
    <class name="Book" type="class">
      <attributes>
        <attribute visibility="-" name="isbn" type="String" />
        <attribute visibility="-" name="title" type="String" />
        <attribute visibility="-" name="author" type="String" />
        <attribute visibility="-" name="subject" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="getAvailableCopies" returnType="int" params="" />
      </methods>
    </class>
    <class name="BookItem" type="class">
      <attributes>
        <attribute visibility="-" name="barcode" type="String" />
        <attribute visibility="-" name="isCheckedOut" type="boolean" />
        <attribute visibility="-" name="dueDate" type="Date" />
      </attributes>
      <methods>
        <method visibility="+" name="checkout" returnType="void" params="member: Member" />
        <method visibility="+" name="returnBook" returnType="void" params="" />
      </methods>
    </class>
    <class name="Account" type="abstract">
      <attributes>
        <attribute visibility="#" name="id" type="String" />
        <attribute visibility="#" name="name" type="String" />
        <attribute visibility="#" name="email" type="String" />
        <attribute visibility="#" name="password" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="login" returnType="boolean" params="" />
        <method visibility="+" name="resetPassword" returnType="void" params="" />
      </methods>
    </class>
    <class name="Member" type="class">
      <attributes>
        <attribute visibility="-" name="borrowedBooks" type="List&lt;BookItem&gt;" />
        <attribute visibility="-" name="maxBooksAllowed" type="int" />
      </attributes>
      <methods>
        <method visibility="+" name="borrowBook" returnType="boolean" params="bookItem: BookItem" />
        <method visibility="+" name="returnBook" returnType="void" params="bookItem: BookItem" />
        <method visibility="+" name="reserveBook" returnType="BookReservation" params="book: Book" />
      </methods>
    </class>
    <class name="Librarian" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="addBook" returnType="void" params="book: Book" />
        <method visibility="+" name="removeBook" returnType="void" params="book: Book" />
        <method visibility="+" name="blockMember" returnType="void" params="member: Member" />
      </methods>
    </class>
    <class name="Catalog" type="class">
      <attributes>
        <attribute visibility="-" name="books" type="Map&lt;String, Book&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="searchByTitle" returnType="List&lt;Book&gt;" params="title: String" />
        <method visibility="+" name="searchByAuthor" returnType="List&lt;Book&gt;" params="author: String" />
        <method visibility="+" name="searchBySubject" returnType="List&lt;Book&gt;" params="subject: String" />
      </methods>
    </class>
    <class name="BookReservation" type="class">
      <attributes>
        <attribute visibility="-" name="reservationDate" type="Date" />
        <attribute visibility="-" name="status" type="ReservationStatus" />
      </attributes>
      <methods>
        <method visibility="+" name="cancel" returnType="void" params="" />
        <method visibility="+" name="fulfill" returnType="void" params="" />
      </methods>
    </class>
    <class name="BookLending" type="class">
      <attributes>
        <attribute visibility="-" name="lendingDate" type="Date" />
        <attribute visibility="-" name="dueDate" type="Date" />
        <attribute visibility="-" name="returnDate" type="Date" />
      </attributes>
      <methods>
        <method visibility="+" name="isOverdue" returnType="boolean" params="" />
        <method visibility="+" name="calculateFine" returnType="double" params="" />
      </methods>
    </class>
    <class name="Fine" type="class">
      <attributes>
        <attribute visibility="-" name="amount" type="double" />
        <attribute visibility="-" name="isPaid" type="boolean" />
        <attribute visibility="-" name="createdAt" type="Date" />
      </attributes>
      <methods>
        <method visibility="+" name="pay" returnType="void" params="" />
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="composition" source="Library" target="Book" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="aggregation" source="Book" target="BookItem" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="inheritance" source="Member" target="Account" />
    <relationship type="inheritance" source="Librarian" target="Account" />
    <relationship type="association" source="Member" target="BookLending" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="association" source="BookLending" target="BookItem" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="association" source="Member" target="BookReservation" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="association" source="BookLending" target="Fine" sourceMultiplicity="1" targetMultiplicity="0..1" />
    <relationship type="composition" source="Library" target="Catalog" sourceMultiplicity="1" targetMultiplicity="1" />
  </relationships>
</diagram>
```

---

## 3. Elevator System (HARD)

```xml
<diagram>
  <classes>
    <class name="Building" type="class">
      <attributes>
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="totalFloors" type="int" />
        <attribute visibility="-" name="elevators" type="List&lt;Elevator&gt;" />
        <attribute visibility="-" name="floors" type="List&lt;Floor&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="addElevator" returnType="void" params="elevator: Elevator" />
        <method visibility="+" name="getFloor" returnType="Floor" params="floorNumber: int" />
      </methods>
    </class>
    <class name="Elevator" type="class">
      <attributes>
        <attribute visibility="-" name="id" type="int" />
        <attribute visibility="-" name="currentFloor" type="int" />
        <attribute visibility="-" name="capacity" type="int" />
        <attribute visibility="-" name="currentLoad" type="int" />
        <attribute visibility="-" name="state" type="ElevatorState" />
        <attribute visibility="-" name="door" type="Door" />
      </attributes>
      <methods>
        <method visibility="+" name="moveToFloor" returnType="void" params="floor: int" />
        <method visibility="+" name="addRequest" returnType="void" params="request: Request" />
        <method visibility="+" name="getState" returnType="ElevatorState" params="" />
        <method visibility="+" name="setState" returnType="void" params="state: ElevatorState" />
      </methods>
    </class>
    <class name="Floor" type="class">
      <attributes>
        <attribute visibility="-" name="floorNumber" type="int" />
        <attribute visibility="-" name="upButton" type="boolean" />
        <attribute visibility="-" name="downButton" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="pressUp" returnType="Request" params="" />
        <method visibility="+" name="pressDown" returnType="Request" params="" />
      </methods>
    </class>
    <class name="ElevatorController" type="class">
      <attributes>
        <attribute visibility="-" name="elevators" type="List&lt;Elevator&gt;" />
        <attribute visibility="-" name="pendingRequests" type="Queue&lt;Request&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="handleRequest" returnType="void" params="request: Request" />
        <method visibility="+" name="selectElevator" returnType="Elevator" params="request: Request" />
      </methods>
    </class>
    <class name="Request" type="class">
      <attributes>
        <attribute visibility="-" name="sourceFloor" type="int" />
        <attribute visibility="-" name="destinationFloor" type="int" />
        <attribute visibility="-" name="direction" type="Direction" />
        <attribute visibility="-" name="timestamp" type="DateTime" />
      </attributes>
      <methods>
        <method visibility="+" name="getDirection" returnType="Direction" params="" />
      </methods>
    </class>
    <class name="Door" type="class">
      <attributes>
        <attribute visibility="-" name="isOpen" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="open" returnType="void" params="" />
        <method visibility="+" name="close" returnType="void" params="" />
      </methods>
    </class>
    <class name="ElevatorState" type="interface">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="handleRequest" returnType="void" params="elevator: Elevator, request: Request" />
        <method visibility="+" name="move" returnType="void" params="elevator: Elevator" />
      </methods>
    </class>
    <class name="MovingUpState" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="handleRequest" returnType="void" params="elevator: Elevator, request: Request" />
        <method visibility="+" name="move" returnType="void" params="elevator: Elevator" />
      </methods>
    </class>
    <class name="MovingDownState" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="handleRequest" returnType="void" params="elevator: Elevator, request: Request" />
        <method visibility="+" name="move" returnType="void" params="elevator: Elevator" />
      </methods>
    </class>
    <class name="IdleState" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="handleRequest" returnType="void" params="elevator: Elevator, request: Request" />
        <method visibility="+" name="move" returnType="void" params="elevator: Elevator" />
      </methods>
    </class>
    <class name="Dispatcher" type="class">
      <attributes>
        <attribute visibility="-" name="strategy" type="DispatchStrategy" />
      </attributes>
      <methods>
        <method visibility="+" name="dispatch" returnType="Elevator" params="request: Request, elevators: List&lt;Elevator&gt;" />
        <method visibility="+" name="setStrategy" returnType="void" params="strategy: DispatchStrategy" />
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="composition" source="Building" target="Elevator" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="composition" source="Building" target="Floor" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="composition" source="Elevator" target="Door" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="inheritance" source="MovingUpState" target="ElevatorState" />
    <relationship type="inheritance" source="MovingDownState" target="ElevatorState" />
    <relationship type="inheritance" source="IdleState" target="ElevatorState" />
    <relationship type="association" source="Elevator" target="ElevatorState" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="association" source="Dispatcher" target="Elevator" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="association" source="ElevatorController" target="Dispatcher" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="association" source="Floor" target="Request" />
  </relationships>
</diagram>
```

---

## 4. Snake & Ladder Game (EASY)

```xml
<diagram>
  <classes>
    <class name="Game" type="class">
      <attributes>
        <attribute visibility="-" name="board" type="Board" />
        <attribute visibility="-" name="players" type="List&lt;Player&gt;" />
        <attribute visibility="-" name="dice" type="Dice" />
        <attribute visibility="-" name="currentPlayerIndex" type="int" />
        <attribute visibility="-" name="isOver" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="start" returnType="void" params="" />
        <method visibility="+" name="playTurn" returnType="void" params="" />
        <method visibility="+" name="getWinner" returnType="Player" params="" />
        <method visibility="+" name="isGameOver" returnType="boolean" params="" />
      </methods>
    </class>
    <class name="Board" type="class">
      <attributes>
        <attribute visibility="-" name="size" type="int" />
        <attribute visibility="-" name="cells" type="List&lt;Cell&gt;" />
        <attribute visibility="-" name="snakes" type="List&lt;Snake&gt;" />
        <attribute visibility="-" name="ladders" type="List&lt;Ladder&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="getCell" returnType="Cell" params="position: int" />
        <method visibility="+" name="addSnake" returnType="void" params="snake: Snake" />
        <method visibility="+" name="addLadder" returnType="void" params="ladder: Ladder" />
      </methods>
    </class>
    <class name="Cell" type="class">
      <attributes>
        <attribute visibility="-" name="position" type="int" />
        <attribute visibility="-" name="hasSnakeHead" type="boolean" />
        <attribute visibility="-" name="hasLadderBottom" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="getPosition" returnType="int" params="" />
      </methods>
    </class>
    <class name="Snake" type="class">
      <attributes>
        <attribute visibility="-" name="head" type="int" />
        <attribute visibility="-" name="tail" type="int" />
      </attributes>
      <methods>
        <method visibility="+" name="getHead" returnType="int" params="" />
        <method visibility="+" name="getTail" returnType="int" params="" />
      </methods>
    </class>
    <class name="Ladder" type="class">
      <attributes>
        <attribute visibility="-" name="bottom" type="int" />
        <attribute visibility="-" name="top" type="int" />
      </attributes>
      <methods>
        <method visibility="+" name="getBottom" returnType="int" params="" />
        <method visibility="+" name="getTop" returnType="int" params="" />
      </methods>
    </class>
    <class name="Player" type="class">
      <attributes>
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="position" type="int" />
      </attributes>
      <methods>
        <method visibility="+" name="move" returnType="void" params="steps: int" />
        <method visibility="+" name="getPosition" returnType="int" params="" />
        <method visibility="+" name="setPosition" returnType="void" params="position: int" />
      </methods>
    </class>
    <class name="Dice" type="class">
      <attributes>
        <attribute visibility="-" name="numberOfDice" type="int" />
        <attribute visibility="-" name="maxValue" type="int" />
      </attributes>
      <methods>
        <method visibility="+" name="roll" returnType="int" params="" />
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="composition" source="Board" target="Cell" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="composition" source="Board" target="Snake" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="composition" source="Board" target="Ladder" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="aggregation" source="Game" target="Player" sourceMultiplicity="1" targetMultiplicity="2..4" />
    <relationship type="composition" source="Game" target="Board" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="composition" source="Game" target="Dice" sourceMultiplicity="1" targetMultiplicity="1" />
  </relationships>
</diagram>
```

---

## 5. Online Bookstore (MEDIUM)

```xml
<diagram>
  <classes>
    <class name="User" type="class">
      <attributes>
        <attribute visibility="-" name="userId" type="String" />
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="email" type="String" />
        <attribute visibility="-" name="shippingAddress" type="Address" />
        <attribute visibility="-" name="cart" type="ShoppingCart" />
      </attributes>
      <methods>
        <method visibility="+" name="placeOrder" returnType="Order" params="" />
        <method visibility="+" name="getOrderHistory" returnType="List&lt;Order&gt;" params="" />
      </methods>
    </class>
    <class name="Book" type="class">
      <attributes>
        <attribute visibility="-" name="isbn" type="String" />
        <attribute visibility="-" name="title" type="String" />
        <attribute visibility="-" name="author" type="String" />
        <attribute visibility="-" name="price" type="double" />
        <attribute visibility="-" name="description" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="getDetails" returnType="String" params="" />
      </methods>
    </class>
    <class name="Catalog" type="class">
      <attributes>
        <attribute visibility="-" name="books" type="List&lt;Book&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="searchByTitle" returnType="List&lt;Book&gt;" params="title: String" />
        <method visibility="+" name="searchByAuthor" returnType="List&lt;Book&gt;" params="author: String" />
        <method visibility="+" name="browseByCategory" returnType="List&lt;Book&gt;" params="category: String" />
      </methods>
    </class>
    <class name="ShoppingCart" type="class">
      <attributes>
        <attribute visibility="-" name="items" type="List&lt;CartItem&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="addItem" returnType="void" params="book: Book, quantity: int" />
        <method visibility="+" name="removeItem" returnType="void" params="book: Book" />
        <method visibility="+" name="getTotal" returnType="double" params="" />
        <method visibility="+" name="clear" returnType="void" params="" />
      </methods>
    </class>
    <class name="CartItem" type="class">
      <attributes>
        <attribute visibility="-" name="book" type="Book" />
        <attribute visibility="-" name="quantity" type="int" />
      </attributes>
      <methods>
        <method visibility="+" name="getSubtotal" returnType="double" params="" />
      </methods>
    </class>
    <class name="Order" type="class">
      <attributes>
        <attribute visibility="-" name="orderId" type="String" />
        <attribute visibility="-" name="orderDate" type="DateTime" />
        <attribute visibility="-" name="status" type="OrderStatus" />
        <attribute visibility="-" name="shippingAddress" type="Address" />
        <attribute visibility="-" name="totalAmount" type="double" />
      </attributes>
      <methods>
        <method visibility="+" name="cancel" returnType="void" params="" />
        <method visibility="+" name="getStatus" returnType="OrderStatus" params="" />
      </methods>
    </class>
    <class name="OrderItem" type="class">
      <attributes>
        <attribute visibility="-" name="book" type="Book" />
        <attribute visibility="-" name="quantity" type="int" />
        <attribute visibility="-" name="priceAtPurchase" type="double" />
      </attributes>
      <methods>
        <method visibility="+" name="getSubtotal" returnType="double" params="" />
      </methods>
    </class>
    <class name="Payment" type="interface">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="processPayment" returnType="boolean" params="amount: double" />
        <method visibility="+" name="refund" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="CreditCardPayment" type="class">
      <attributes>
        <attribute visibility="-" name="cardNumber" type="String" />
        <attribute visibility="-" name="expiryDate" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="processPayment" returnType="boolean" params="amount: double" />
        <method visibility="+" name="refund" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="WalletPayment" type="class">
      <attributes>
        <attribute visibility="-" name="walletId" type="String" />
        <attribute visibility="-" name="balance" type="double" />
      </attributes>
      <methods>
        <method visibility="+" name="processPayment" returnType="boolean" params="amount: double" />
        <method visibility="+" name="refund" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="Address" type="class">
      <attributes>
        <attribute visibility="-" name="street" type="String" />
        <attribute visibility="-" name="city" type="String" />
        <attribute visibility="-" name="state" type="String" />
        <attribute visibility="-" name="zipCode" type="String" />
        <attribute visibility="-" name="country" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="toString" returnType="String" params="" />
      </methods>
    </class>
    <class name="Inventory" type="class">
      <attributes>
        <attribute visibility="-" name="stockMap" type="Map&lt;Book, int&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="checkAvailability" returnType="boolean" params="book: Book, quantity: int" />
        <method visibility="+" name="reduceStock" returnType="void" params="book: Book, quantity: int" />
        <method visibility="+" name="addStock" returnType="void" params="book: Book, quantity: int" />
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="composition" source="ShoppingCart" target="CartItem" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="composition" source="Order" target="OrderItem" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="association" source="CartItem" target="Book" sourceMultiplicity="*" targetMultiplicity="1" />
    <relationship type="association" source="OrderItem" target="Book" sourceMultiplicity="*" targetMultiplicity="1" />
    <relationship type="association" source="User" target="ShoppingCart" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="association" source="User" target="Order" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="inheritance" source="CreditCardPayment" target="Payment" />
    <relationship type="inheritance" source="WalletPayment" target="Payment" />
    <relationship type="association" source="Order" target="Payment" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="association" source="Order" target="Address" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="association" source="Catalog" target="Book" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="association" source="Inventory" target="Book" sourceMultiplicity="1" targetMultiplicity="*" />
  </relationships>
</diagram>
```

---

## 6. Hotel Reservation System (MEDIUM)

```xml
<diagram>
  <classes>
    <class name="Hotel" type="class">
      <attributes>
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="address" type="String" />
        <attribute visibility="-" name="rooms" type="List&lt;Room&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="searchAvailableRooms" returnType="List&lt;Room&gt;" params="checkIn: Date, checkOut: Date, type: RoomType" />
        <method visibility="+" name="addRoom" returnType="void" params="room: Room" />
      </methods>
    </class>
    <class name="Room" type="class">
      <attributes>
        <attribute visibility="-" name="roomNumber" type="String" />
        <attribute visibility="-" name="type" type="RoomType" />
        <attribute visibility="-" name="ratePerNight" type="double" />
        <attribute visibility="-" name="status" type="RoomStatus" />
      </attributes>
      <methods>
        <method visibility="+" name="isAvailable" returnType="boolean" params="checkIn: Date, checkOut: Date" />
        <method visibility="+" name="setStatus" returnType="void" params="status: RoomStatus" />
      </methods>
    </class>
    <class name="RoomType" type="class">
      <attributes>
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="maxOccupancy" type="int" />
        <attribute visibility="-" name="amenities" type="List&lt;String&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="getName" returnType="String" params="" />
      </methods>
    </class>
    <class name="Guest" type="class">
      <attributes>
        <attribute visibility="-" name="guestId" type="String" />
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="email" type="String" />
        <attribute visibility="-" name="phone" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="makeReservation" returnType="Reservation" params="room: Room, checkIn: Date, checkOut: Date" />
        <method visibility="+" name="getReservations" returnType="List&lt;Reservation&gt;" params="" />
      </methods>
    </class>
    <class name="Reservation" type="class">
      <attributes>
        <attribute visibility="-" name="reservationId" type="String" />
        <attribute visibility="-" name="checkInDate" type="Date" />
        <attribute visibility="-" name="checkOutDate" type="Date" />
        <attribute visibility="-" name="status" type="ReservationStatus" />
        <attribute visibility="-" name="totalCost" type="double" />
      </attributes>
      <methods>
        <method visibility="+" name="confirm" returnType="void" params="" />
        <method visibility="+" name="cancel" returnType="void" params="" />
        <method visibility="+" name="checkIn" returnType="void" params="" />
        <method visibility="+" name="checkOut" returnType="void" params="" />
      </methods>
    </class>
    <class name="Payment" type="interface">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="processPayment" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="CreditCardPayment" type="class">
      <attributes>
        <attribute visibility="-" name="cardNumber" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="processPayment" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="CashPayment" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="processPayment" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="RoomStatus" type="class">
      <attributes>
        <attribute visibility="-" name="state" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="getState" returnType="String" params="" />
        <method visibility="+" name="transitionTo" returnType="void" params="newState: String" />
      </methods>
    </class>
    <class name="Housekeeper" type="class">
      <attributes>
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="assignedRooms" type="List&lt;Room&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="cleanRoom" returnType="void" params="room: Room" />
        <method visibility="+" name="reportMaintenance" returnType="void" params="room: Room" />
      </methods>
    </class>
    <class name="Invoice" type="class">
      <attributes>
        <attribute visibility="-" name="invoiceId" type="String" />
        <attribute visibility="-" name="amount" type="double" />
        <attribute visibility="-" name="issueDate" type="Date" />
        <attribute visibility="-" name="isPaid" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="generateInvoice" returnType="void" params="" />
        <method visibility="+" name="markAsPaid" returnType="void" params="" />
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="composition" source="Hotel" target="Room" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="association" source="Room" target="RoomType" sourceMultiplicity="*" targetMultiplicity="1" />
    <relationship type="association" source="Guest" target="Reservation" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="association" source="Reservation" target="Room" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="association" source="Reservation" target="Payment" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="association" source="Room" target="RoomStatus" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="inheritance" source="CreditCardPayment" target="Payment" />
    <relationship type="inheritance" source="CashPayment" target="Payment" />
    <relationship type="association" source="Housekeeper" target="Room" sourceMultiplicity="1" targetMultiplicity="*" />
    <relationship type="association" source="Reservation" target="Invoice" sourceMultiplicity="1" targetMultiplicity="1" />
  </relationships>
</diagram>
```

---

## 7. ATM Machine (HARD)

```xml
<diagram>
  <classes>
    <class name="ATM" type="class">
      <attributes>
        <attribute visibility="-" name="atmId" type="String" />
        <attribute visibility="-" name="location" type="String" />
        <attribute visibility="-" name="cashAvailable" type="double" />
        <attribute visibility="-" name="state" type="ATMState" />
      </attributes>
      <methods>
        <method visibility="+" name="authenticate" returnType="boolean" params="card: Card, pin: String" />
        <method visibility="+" name="executeTransaction" returnType="void" params="transaction: Transaction" />
        <method visibility="+" name="setState" returnType="void" params="state: ATMState" />
        <method visibility="+" name="getState" returnType="ATMState" params="" />
      </methods>
    </class>
    <class name="CardReader" type="class">
      <attributes>
        <attribute visibility="-" name="isCardInserted" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="readCard" returnType="Card" params="" />
        <method visibility="+" name="ejectCard" returnType="void" params="" />
      </methods>
    </class>
    <class name="CashDispenser" type="class">
      <attributes>
        <attribute visibility="-" name="currentCash" type="double" />
      </attributes>
      <methods>
        <method visibility="+" name="dispenseCash" returnType="boolean" params="amount: double" />
        <method visibility="+" name="hasSufficientCash" returnType="boolean" params="amount: double" />
      </methods>
    </class>
    <class name="Keypad" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="getInput" returnType="String" params="" />
        <method visibility="+" name="getPin" returnType="String" params="" />
      </methods>
    </class>
    <class name="Screen" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="displayMessage" returnType="void" params="message: String" />
        <method visibility="+" name="displayMenu" returnType="void" params="options: List&lt;String&gt;" />
        <method visibility="+" name="displayBalance" returnType="void" params="balance: double" />
      </methods>
    </class>
    <class name="Account" type="class">
      <attributes>
        <attribute visibility="-" name="accountNumber" type="String" />
        <attribute visibility="-" name="balance" type="double" />
        <attribute visibility="-" name="accountHolder" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="getBalance" returnType="double" params="" />
        <method visibility="+" name="debit" returnType="boolean" params="amount: double" />
        <method visibility="+" name="credit" returnType="void" params="amount: double" />
      </methods>
    </class>
    <class name="Bank" type="class">
      <attributes>
        <attribute visibility="-" name="bankName" type="String" />
        <attribute visibility="-" name="bankCode" type="String" />
      </attributes>
      <methods>
        <method visibility="+" name="verifyAccount" returnType="boolean" params="card: Card, pin: String" />
        <method visibility="+" name="getAccount" returnType="Account" params="card: Card" />
        <method visibility="+" name="processTransaction" returnType="boolean" params="transaction: Transaction" />
      </methods>
    </class>
    <class name="Card" type="class">
      <attributes>
        <attribute visibility="-" name="cardNumber" type="String" />
        <attribute visibility="-" name="bankCode" type="String" />
        <attribute visibility="-" name="expiryDate" type="Date" />
      </attributes>
      <methods>
        <method visibility="+" name="getCardNumber" returnType="String" params="" />
        <method visibility="+" name="isExpired" returnType="boolean" params="" />
      </methods>
    </class>
    <class name="Transaction" type="abstract">
      <attributes>
        <attribute visibility="#" name="transactionId" type="String" />
        <attribute visibility="#" name="timestamp" type="DateTime" />
        <attribute visibility="#" name="amount" type="double" />
        <attribute visibility="#" name="status" type="TransactionStatus" />
      </attributes>
      <methods>
        <method visibility="+" name="execute" returnType="boolean" params="account: Account" />
      </methods>
    </class>
    <class name="Withdrawal" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="execute" returnType="boolean" params="account: Account" />
      </methods>
    </class>
    <class name="Deposit" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="execute" returnType="boolean" params="account: Account" />
      </methods>
    </class>
    <class name="Transfer" type="class">
      <attributes>
        <attribute visibility="-" name="targetAccount" type="Account" />
      </attributes>
      <methods>
        <method visibility="+" name="execute" returnType="boolean" params="account: Account" />
      </methods>
    </class>
    <class name="BalanceInquiry" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="execute" returnType="boolean" params="account: Account" />
      </methods>
    </class>
    <class name="ATMState" type="interface">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="insertCard" returnType="void" params="atm: ATM" />
        <method visibility="+" name="authenticate" returnType="void" params="atm: ATM, pin: String" />
        <method visibility="+" name="selectTransaction" returnType="void" params="atm: ATM" />
        <method visibility="+" name="ejectCard" returnType="void" params="atm: ATM" />
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="composition" source="ATM" target="CardReader" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="composition" source="ATM" target="CashDispenser" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="composition" source="ATM" target="Keypad" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="composition" source="ATM" target="Screen" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="inheritance" source="Withdrawal" target="Transaction" />
    <relationship type="inheritance" source="Deposit" target="Transaction" />
    <relationship type="inheritance" source="Transfer" target="Transaction" />
    <relationship type="inheritance" source="BalanceInquiry" target="Transaction" />
    <relationship type="association" source="ATM" target="ATMState" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="association" source="ATM" target="Bank" sourceMultiplicity="*" targetMultiplicity="1" />
    <relationship type="association" source="Card" target="Account" sourceMultiplicity="1" targetMultiplicity="1" />
  </relationships>
</diagram>
```

---

## 8. Chess Game (HARD)

```xml
<diagram>
  <classes>
    <class name="Game" type="class">
      <attributes>
        <attribute visibility="-" name="board" type="Board" />
        <attribute visibility="-" name="players" type="Player[2]" />
        <attribute visibility="-" name="currentTurn" type="Player" />
        <attribute visibility="-" name="status" type="GameStatus" />
        <attribute visibility="-" name="moveHistory" type="List&lt;Move&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="start" returnType="void" params="" />
        <method visibility="+" name="makeMove" returnType="boolean" params="move: Move" />
        <method visibility="+" name="isCheck" returnType="boolean" params="player: Player" />
        <method visibility="+" name="isCheckmate" returnType="boolean" params="player: Player" />
        <method visibility="+" name="isStalemate" returnType="boolean" params="" />
        <method visibility="+" name="getStatus" returnType="GameStatus" params="" />
      </methods>
    </class>
    <class name="Board" type="class">
      <attributes>
        <attribute visibility="-" name="cells" type="Cell[8][8]" />
      </attributes>
      <methods>
        <method visibility="+" name="getCell" returnType="Cell" params="row: int, col: int" />
        <method visibility="+" name="movePiece" returnType="void" params="from: Cell, to: Cell" />
        <method visibility="+" name="isValidMove" returnType="boolean" params="move: Move" />
        <method visibility="+" name="initialize" returnType="void" params="" />
      </methods>
    </class>
    <class name="Cell" type="class">
      <attributes>
        <attribute visibility="-" name="row" type="int" />
        <attribute visibility="-" name="col" type="int" />
        <attribute visibility="-" name="piece" type="Piece" />
      </attributes>
      <methods>
        <method visibility="+" name="isEmpty" returnType="boolean" params="" />
        <method visibility="+" name="getPiece" returnType="Piece" params="" />
        <method visibility="+" name="setPiece" returnType="void" params="piece: Piece" />
        <method visibility="+" name="removePiece" returnType="Piece" params="" />
      </methods>
    </class>
    <class name="Piece" type="abstract">
      <attributes>
        <attribute visibility="#" name="color" type="Color" />
        <attribute visibility="#" name="isAlive" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="canMove" returnType="boolean" params="board: Board, from: Cell, to: Cell" />
        <method visibility="+" name="getValidMoves" returnType="List&lt;Cell&gt;" params="board: Board, from: Cell" />
      </methods>
    </class>
    <class name="King" type="class">
      <attributes>
        <attribute visibility="-" name="hasMoved" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="canMove" returnType="boolean" params="board: Board, from: Cell, to: Cell" />
        <method visibility="+" name="canCastle" returnType="boolean" params="board: Board, rook: Rook" />
      </methods>
    </class>
    <class name="Queen" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="canMove" returnType="boolean" params="board: Board, from: Cell, to: Cell" />
      </methods>
    </class>
    <class name="Rook" type="class">
      <attributes>
        <attribute visibility="-" name="hasMoved" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="canMove" returnType="boolean" params="board: Board, from: Cell, to: Cell" />
      </methods>
    </class>
    <class name="Bishop" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="canMove" returnType="boolean" params="board: Board, from: Cell, to: Cell" />
      </methods>
    </class>
    <class name="Knight" type="class">
      <attributes>
      </attributes>
      <methods>
        <method visibility="+" name="canMove" returnType="boolean" params="board: Board, from: Cell, to: Cell" />
      </methods>
    </class>
    <class name="Pawn" type="class">
      <attributes>
        <attribute visibility="-" name="hasMoved" type="boolean" />
      </attributes>
      <methods>
        <method visibility="+" name="canMove" returnType="boolean" params="board: Board, from: Cell, to: Cell" />
        <method visibility="+" name="canPromote" returnType="boolean" params="row: int" />
      </methods>
    </class>
    <class name="Player" type="class">
      <attributes>
        <attribute visibility="-" name="name" type="String" />
        <attribute visibility="-" name="color" type="Color" />
        <attribute visibility="-" name="capturedPieces" type="List&lt;Piece&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="makeMove" returnType="Move" params="from: Cell, to: Cell" />
      </methods>
    </class>
    <class name="Move" type="class">
      <attributes>
        <attribute visibility="-" name="player" type="Player" />
        <attribute visibility="-" name="fromCell" type="Cell" />
        <attribute visibility="-" name="toCell" type="Cell" />
        <attribute visibility="-" name="pieceMoved" type="Piece" />
        <attribute visibility="-" name="pieceCaptured" type="Piece" />
        <attribute visibility="-" name="timestamp" type="DateTime" />
      </attributes>
      <methods>
        <method visibility="+" name="isCapture" returnType="boolean" params="" />
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="composition" source="Board" target="Cell" sourceMultiplicity="1" targetMultiplicity="64" />
    <relationship type="association" source="Cell" target="Piece" sourceMultiplicity="1" targetMultiplicity="0..1" />
    <relationship type="inheritance" source="King" target="Piece" />
    <relationship type="inheritance" source="Queen" target="Piece" />
    <relationship type="inheritance" source="Rook" target="Piece" />
    <relationship type="inheritance" source="Bishop" target="Piece" />
    <relationship type="inheritance" source="Knight" target="Piece" />
    <relationship type="inheritance" source="Pawn" target="Piece" />
    <relationship type="composition" source="Game" target="Board" sourceMultiplicity="1" targetMultiplicity="1" />
    <relationship type="aggregation" source="Game" target="Player" sourceMultiplicity="1" targetMultiplicity="2" />
    <relationship type="association" source="Move" target="Cell" sourceMultiplicity="1" targetMultiplicity="2" />
    <relationship type="association" source="Move" target="Player" sourceMultiplicity="*" targetMultiplicity="1" />
    <relationship type="association" source="Game" target="Move" sourceMultiplicity="1" targetMultiplicity="*" />
  </relationships>
</diagram>
```
