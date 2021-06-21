### [Home](./index.html)

# Ukkonen 

## Suffix Link 

- For an internal node **U** that yields **str[j....k]** 
- Follow the suffix link to reach another internal node **V**
  - **V** yields **str[j+1...k]**



## Active Node and Remainder 

- If **U** is root, then remove a character from the remainder  
- **Rule** 3 **extensions in Ukkonen’s**
  - Add the character **str**[i] to the remainder



## Suffix Link 

### Lemma 1 : Rule 2s are never followed by Rule 1s

- If extension j of phase i + 1 was performed using rule 2
  - the path **str[j . . . i]** **does not end at a leaf** and 
  - can only be continued by characters that are **not str[i + 1]**.  (by creating *a new leaf node*)
- As this path **doesn’t end at a leaf** it must be ***a proper prefix of a longer path str[k...i+1]***.
  - note that **k < j** since **str[k...i+1]** is a longer path 
  - Extension k has already been performed in phase i + 1.  
- In each phase, the **suffixes** (of the prefix) are added to the tree in order of **descending length**, 
  - after the suffix **str**[k...i+1] was added the suffix **str**[k+1...i+1] must have been added. 
- As **str**[j...i] is a proper prefix of **str**[k...i+1], 
  - **str**[j+1...i] must be a proper prefix of **str**[k+1...i+1], which already exists in the tree
- Thus, the path **str**[j + 1 . . . i] cannot end at a leaf 



### Lemma 2: There’s more structure below the shorter path

- That is the subtree below **str**[j + 1 . . . i] always contains the subtree below **str**[j . . . i]
- Same as Lemma 1
  - because **str[j...i]** is already in the tree 
  - **str[j+1...i]**  is the next extension, 
- Therefore at the end of any given phase **k > i** (when we have a completed implicit suffix tree Tk ) 
  - any path x that exists below **str**[j . . . i] must also exist below **str**[j + 1 . . . i]  
  - so the subtree below **str**[j . . . i] exists below **str**[j + 1 . . . i].



## Stopper Rule 

### Lemma 3: Rule 3s are followed by rule 3s

- if a rule 3 occurs in extension j then the path **str**[j . . . i] must be continued by **str**[i + 1]
- **Lemma 1** 
  - As **str**[j...i] is a proper prefix of **str**[k...i+1], 
  -  S[j+1…i+1] must also be a proper prefix of S[k+1…i+1]
- Thus, the path S[j+1…i+1] must also already exist in our tree and extension j+1 will also be performed using  rule 3
- Applying the same logic, 
  - if extension j+1 is performed using rule 3, then extension j+2 will also  be performed using rule 3 
  - j+2.... j+3 
  - .... 
  - and so on until the end of the phase

- Thus, if extension j in phase i+1 was performed using rule 3, all remaining extensions in phase i+1 will be  performed using rule 3 





## Why lastj 

### Lemma 4: Rule 1s are rule 1s in the next phase

- If extension **j** of phase **i** is a rule 1 extension the path **str**[j . . . i−1] must end at leaf j.
  - This path is then extended to **str**[j . . . i] by extension j. 
- Every extension **after** extension j in phase i traverses a shorter path than **str**[j . . . i] and so will never reach leaf j. 
  - **str[i]** is added to the path by rule 1
  - or **str[i]** is a new leaf by rule 2 
  - Thus, no changes to leaf j after extension j in phase i 
- Every extension **before** extension j in phase i + 1 will traverse a longer path than **str**[j . . . i] and so will never reach the leaf j. 
  - thus, no changes to leaf j before extension j in phase i+1
- There is no changes to leaf j 
  - after the extension j in phase i 
  - before the extension j in phase i+1
- Thus, by extension j in phase i + 1 the path **str**[j . . . i] still exists in the tree and still ends at leaf j. 

- Extension j of phase i + 1 will be performed using rule 1.



### Lemma 5: Rule 2s are rule 1s in the next phase

- If extension j in phase i is performed using rule 2 then this extension **creates a leaf numbered j** whose path from the root is **str**[j . . . i].
- By the same logic presented for lemma 4, 
  - the path **str**[j . . . i] still exists in the tree and still ends at **leaf j** 
  - until extension j of the next phase i + 1 (we are going to do)
- This extension then traverses the full path **str**[j . . . i] to leaf j and extends it to **str**[j ...i + 1] using rule 1.





## Time Complexity 

- **Rule 3** will repeat **at most one character** 
  - hence, O(2n) 
- **Suffix Link** will O(n) 
  - without explicit comparisions since skip-counting 
  - the number of node is bound to  



