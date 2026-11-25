# Changelog

## 1.12.2
Update from 1.12.1: install the new zip the same way as before. Your looks, wears, names and settings are kept.

### Switch 2 preset (new)
- **Switch 2**, in the Cartridge Presets right after **Switch**. It is the Switch preset with a different cartridge: the same case, band color, frame color and thickness, but the card is red, and the mark in its red band is simpler and centered: two larger white dots (rounded squares, close together), with two tiny white lines of the same length under them (the lower one a little thicker), the whole mark almost a square.
- **Switch 2** is also a case shape (after **Switch** in the *Case shape* rows), so a game or collection can use the Switch 2 card with any preset.

### Filter Collections
- The **Games** tab has a new **Filter Collections** button, to the right of **Show Uninstalled Games**. It opens a list of your collections; choose one or more and the games list shows only the games that are in any of them (the button then shows how many are chosen). Choose a collection again to remove it, or use **Clear Filter**, which is always the first button in the list (grayed out while no collection is chosen), so the collections never shift when you choose the first one. The filter works together with the search and **Show Uninstalled Games**, and **Select all** only selects the games that are shown. It is kept while you are inside a game's settings, so Back returns to the same filtered list.
- The buttons above the list are now three to a row, so **Select all N shown by search** and **Choose a preset or settings for N** (while selecting multiple) sit on the row below.

### Game Boy and Game Boy Color prints
- The **GB** and **GBC** presets now print **Cover (Fill)** on their cartridges, like **NES** and **N64**, unless a game or collection (or the Print setting of its own) says otherwise. A preset's print still wins over the global *Game Cover Style*; a game's or collection's own setting wins over the preset's.

## 1.12.1
Update from 1.12.0: install the new zip the same way as before. Your looks, wears, names and settings are kept.

### Xbox presets
- **Xbox** and **Xbox One/Series** now have the Xbox 360's case color and frame color (the light green case and frame, with the dark text and the lighter outline that go with it). Each keeps its own band color and the Xbox its black disc.

### Case Interior Color (new)
- **Case Interior Color** (Configuration, per game and per collection, next to *Frame Color*): the color of the inside of the box in the insert and eject animation, that is the tray the disc or cartridge sits in and the inside of the front cover.
- *Automatic* matches the frame color of the preset (and follows a frame color or case color set for the game or collection). A preset that comes without a frame (NES, SNES, N64, GB, GBC, GBA) keeps the black it had before.
- The hub and its rings on a disc tray are drawn a shade lighter than the tray (a shade darker when the tray is light). *Clear Overrides* and *Reset* remove it, and the list of a game's or collection's settings says *own interior color*.

### Cartridge inserts
- The recess the cartridge sits in (inside the case, in the insert and eject animation) now has the cartridge's own outline and rounded corners, with a lighter rim around it, instead of a plain rectangle.

### Menu navigation
- **Focus on opening.** Opening Configuration focuses the *Search games* field at once (the Collections and Presets tabs focus their first row), instead of starting with nothing focused and then jumping to the *Games* tab on the first button press.
- **Game, collection and preset pages.** They open with the focus already in place, so "down" works at once: on **Automatic** under *Preset* for a game or collection (on the current preset for the default), and on the *Name* field for one of your own presets.
- **B goes back one step.** The cause of the stuck page was the tab bar, which was only hidden while a game or collection page was open and still took part in the controller's navigation: "up" went to a tab nobody could see, and B (with the focus there) closed the whole Configuration page. The tabs are no longer drawn while a settings page is open; your tab, search and row are kept, so Back returns to them.
- **New Preset.** Back from a new preset returns to its row in the list.

## 1.12.0
Update from 1.11.x: install the new zip the same way as before. Your looks, wears, names and settings are kept; every new option starts at the old behaviour (except the two removed looks, below).

### Cartridges (new details)
- **Game Boy and Game Boy Color:** the label has the light vertical strip on each side of the art, as on the real cartridges, each with three small black dots in a column. The label and strips are measured from the real cartridges.
- **SNES:** the label is the real black "U" around the art window, with the red strip, the lighter box, the Nintendo-style logo shape, the purple arrow, the seal, the rows of white dots and the red lines of the Super Nintendo logo.
- **NES:** the strips run up into a darker boxed hole at the top, the smooth box where they stop is at the bottom, the two small notches are in the top corners, and the arrow sits under the art as far from the strips as from the art. No white border around the art.
- **N64:** the SNES's color, no white border around the art, the art's top rounded to match the round top, the two vertical lines beside the art, and a line in each lower corner running from the bottom out to the side.
- **GBA:** the Switch cartridge's color, no white border around the art, the scooped lip at the top.
- **Game Boy Color:** the circuit board is rearranged after the real cartridge, with the silver battery faintly visible on the right; the gold pins span more of the cartridge.
- **Gold pins:** only the Game Boy Color shows them now.
- **Embedded arrows:** the Game Boy (bigger, midway between the art and the bottom), GBA, DS, 3DS and Switch cartridges have the downward arrow pressed into the plastic at the bottom.
- **DS and 3DS:** the line in the top band and its bigger right part (which grows downward from the line) are centered in the band together. The DS is the Switch cartridge's color. The 3DS is as tall as the DS and keeps its rounded lower-left corner. On both, the label and its bands span most of the cartridge's height (measured from a real 3DS cartridge), with the slanted lower-left corner pointing at the cartridge's lower-left corner. The cartridges' own lower-left corner is rounder.

### Configuration (new)
- **Logo Position:** with a disc in use and **Logo** as its print, the row *Automatic, Top, Left, Right, Bottom* moves the logo to that part of the disc. Automatic is Top, as it was.
- **Cover Art Position:** when the print is **Cover (Fill)** an *Adjust Art Vertically* slider (-50% to 50%) moves the cover down (+) or up (-) on the disc or cartridge. 0 (Automatic) is where the art started, centered.
- Both are saved per game and per collection, and *Clear Overrides* removes them.

### Game page
- The cover in the **Game Info** tab is shown plain, without the case, band, frame or wear of the library. The page is recognised from Steam's own router as well as the window's address; a cover standing alone on a game's page is left plain; covers in shelves and grids stay cases. The Self-Check has a *game page* line.

### Lean of the neighbours (new)
- *Neighbours lean away* now has a **Lean of the neighbours** slider under it (1° to 30°). 9° is the old fixed lean and stays the default.

### Wear section, case names, Games tab
- With Override on, the wear choices have 16px of room above them (under the divider) as well as below them.
- With Wear off, *Variable Case Thickness* sits at the same distance as the settings above it (the divider line only shows while Wear is on).
- **Wear** (Quick Access panel): only the toggle shows until it is on; then *Wear Slowly*, *Normal*, *Wear Fast* and **Override**. With Override, a divider leads to the wear choices: Sealed, Mint, Light Scuffs, Well-Worn, Battered, Sun-Faded, Rental Sticker (one list, least to most wear; the "Not Playtime-Based" header is gone, here and in Configuration). Override gives every case that wear; with Wear off, cases have none (unless a game or collection has its own). An old save with a default wear and Wear off becomes Wear on + Override, so it looks the same.
- **Variable Case Thickness** (was Case Thickness Variation); the Quick Access header is **Case Thickness**. The cases are named by their thickness everywhere: **Standard**, **Thin**, **Thick** (were Keep Case, Jewel Case, Big Box). In Configuration the options are Automatic, **Preset-Variable** (was Vary with Preset), Standard, Thin, Thick. Preset-Variable still differs from Automatic when *Variable Case Thickness* is off.
- *Focused Game Tilt* shows degrees. More space between the slot row and the game-logo row, and between the neighbor choice row and the speed row.
- **Configuration:** color choices run Black, White, Silver, Red, Blue, Green, Yellow, Gold, Orange, Cyan, Purple, Pink; the preview text is in Title Case (and its sentence about your own preset is gone); in the **Games** tab a game without settings says *Default*, *Select several* is **Select Multiple**, and **Show Uninstalled Games** (off by default) lists the games that are not installed on this device.
- **DS cartridge:** the lower-left corner is rounder.

### Thickness is Thin, Standard or Thick; Restore Global Defaults
- **Box Thickness** (Quick Access panel) is three buttons now, **Thin, Standard, Thick** (the slider is gone). It is the default box thickness for every case; with **Case Thickness Variation** on, presets that have a thickness of their own (the old cartridges are thick, the Switch and the jewel case thin) override it, while the presets that are a DVD case follow the default. Standard is the default. A DVD case is 18 px, Thin 12 px, Thick 30 px.
- The preview says **Thin, Standard or Thick**; a percentage appears only when you have adjusted the thickness with the *Adjust Thickness* slider, and it is the change from that size.
- **Restore Global Defaults** (was Restore Defaults) puts every global setting back to its default, the default preset, the default wear and the fallback choice included. It keeps your custom presets, the settings of each game and collection (that is *Clear Overrides*), safe mode and the first-run flag.
- **DS and 3DS cartridges:** the top band holds one black line in the middle, a little bigger at its right end (and red at the start of that end on the 3DS, where the 3 is). The 3DS's row of dashes in the bottom band is on the DS too, at the right end.

### Names, wear order, art window options, Tools
- **Case Thickness Variation** (was Varying Box Thickness). **Adjust Thickness** moves in steps of 1%. (The Box Thickness slider became buttons, see the next entry.)
- **Cartridge art window:** *Black* (was Dark Backdrop), **White** and *Match Cartridge* globally; *Match Cartridge* is also an option next to Automatic in Configuration.
- **Keep Case** (was Keepcase). The DS and 3DS marks are a square outline and bars, like the Switch's (no lettering).
- **Wear** is listed from least to most wear: Sealed, Mint, Light Scuffs, Well-Worn, Battered; then, set apart under *Not Playtime-Based*, Sun-Faded and Rental Sticker (Quick Access panel and Configuration). By playtime: never played = Sealed; under 1 hour = Mint; 1 to 10 hours = Light Scuffs; 10 to 50 hours = Well-Worn; over 50 hours = Battered (the hours double with *Wears slowly* and halve with *Wears fast*). Sun-Faded needs a game played for at least an hour and then not for over a year; the Rental Sticker is only ever set by hand.
- **Presets tab:** no sub-texts under the tabs; *Default Preset*, *Custom Presets*, *New Preset*, *Reload Templates*.
- **Tools** now holds everything that was under *Fallback and safe mode*: Run Self-Check, Save Report, View Results, the Fallback choice, Safe Mode, Restore Defaults, Clear Overrides (the last two were *Reset case, animation and effect settings* and *Clear all game and collection settings*). The divider under *Neighbors Lean Away* is gone.

### Thickness scale, DS and 3DS labels, Switch corner
- **New scale.** A standard DVD case is **100%**: the *Box Thickness* slider (Quick Access panel) is the thickness of a DVD case in pixels, and every percentage is relative to it. The default is **18** (it was 24, so a DVD case is 75% of what it was; saved values are scaled by 75% once). The thick cases (Big Box, NES, SNES, N64, GB, GBC, GBA) are **125%** of the old standard (30 px at the default) and the thin ones (Jewel Case, Switch) stay at **50%** (12 px); in the new scale that is 167% and 67% of a DVD case.
- **Case Thickness for this Game:** one row of options, **Automatic, Thin, Standard, Thick, Vary with Preset** (Thin, Standard and Thick set the thickness for the game or collection; Vary with Preset is each preset's own), and the *Adjust Thickness* slider on top (100% = no adjustment, relative to a DVD case). The percentage buttons, including Thickest (200%), are gone.
- **DS and 3DS cartridges:** the label is a white sticker with a white band over the top, carrying the console's logo, and one under the art window; the art window is what is between them. The DS follows the reference picture (its window's top edge steps up in the middle, its label is a little narrower); the 3DS band has the number line. Cartridge colors are unchanged. The cut corner is a little smaller (6).
- **Switch cartridge:** the gloss over a cartridge was a plain square and stuck out of the rounded upper-left corner; it follows the shape now.

### Frames that disappeared with some art
- A frame could be invisible (the art was shrunk but the border was transparent) for some games, depending on their art. The frame's color was only painted as the cover image's own background, and the browser leaves that background out for some images. The frame is now also painted by the cover's overlay (the layer that carries the band, the wear and the shine, which is always drawn), so it shows whatever the art is. Simple covers (no overlay) get an inset shadow of the frame color as well, and the image's own background is now marked `!important`.

### Presets and cartridges, a divider
- The **NES** and **N64** presets print **Cover (Fill)** on their cartridges unless a game or collection (or the Print setting of its own) says otherwise. A preset's print wins over the global *Game Cover Style*; a game's or collection's own wins over the preset's.
- The **Wii** disc is white, like the Wii U's.
- The **GBA** cartridge is as dark as the DS's.
- A divider line sits above *Varying Box Thickness*, with 16px of room above it so it does not touch the default wear buttons (and 4px below it).

### Presets without frames, preview with the game's art, Back fix
- **NES, SNES, N64, GB, GBC and GBA** come without a frame: with *Frame* on Automatic they have none. A game or collection can still switch the frame on, and the other presets keep following the global *Frames* switch.
- **Back / B** now return to the tab you came from with the tab bar exactly as it was (it used to jump to *Games* on the first direction you pressed): the tab bar stays in place while a game's or collection's settings are open. The row you came from is focused again.
- The preview in a **game's** Configuration page shows that game's own cover (custom art first) and logo, found the same way the insert animation finds them; a game without a logo shows its whole cover on the disc or cartridge, as in the animation. Collections and selections keep the stand-in art.
- *Thickness for this Game* is **Case Thickness for this Game** (and collection). The **logo on discs** is a little higher again. The **Wear** toggle has no divider line under it.

### Configuration pages, case color, thickness values
- **Case Color** per game or collection: the color of the box (sides, back, spine). The frame follows it unless it has a color of its own; the band keeps the preset's.
- **Reset** next to Back clears every override of a game, collection or selection. Choosing a preset, Automatic, or the preset that is already set does the same in favor of that preset.
- **Overrides** header (set apart by lines) over the line "Everything below overrides their equivalent global settings when something other than Automatic is set." Headers read like "Insert Animation for this Game"; the sub-texts are gone except the one under Preset: "Choose a console preset below or select Automatic for the default preset (...)". Options renamed: No Band, No Frame, Vary with Preset, Automatic (was Preset's own), Adjust Thickness.
- **Back and B remember** the tab, the search and the row you came from (the row is focused again and scrolled into view).
- **Thickness:** the Big Box and every preset that was twice a DVD case (NES, SNES, N64, GB, GBC, GBA) are **150%** now; the Jewel Case and the Switch are **50%**.
- **Cyan** replaces the "Clear blue" color; the **GBA** cartridge is darker; the **DS** box is white; the **logo on a disc** sits a little higher (also on GameCube discs).
- Giving your own preset a name was already there: *Presets* tab, *New preset*, the *Name* field.

### Small text changes
- **Configuration** (was Configure). *Frames*: "Shrinks game art slightly and adds a border matching the box's color." Wear buttons: Light Scuffs, Well-Worn, Sun-Faded, Rental Sticker. A *Game Cover Style* header over the print buttons. Effects: Hover on Focus, Foil Shine on Focus, Plastic Sleeve & Rounded Corners, Pick Up on Select, Focused Game Tilt, Neighbors Lean Away, Lean Amount, Hide Box at Once, Settle Flat First, Normal, Plastic Gloss; their descriptions (and the Insert Speed one) are gone, and so is the *Default Wear* header.

### Quick Access panel reorganized, slot and timing per game, art window option
- **Cartridge art window color, global:** *Dark Backdrop* (the default) or *Match Cartridge*, under *Disc and Cartridge Print*. A game's or collection's own color still wins, and its "Automatic" follows the global choice.
- **Slot and game-logo timing per game or collection:** *Bottom Slot* / *Side Slot* and *Before Game Logo* / *After Game Logo* can be set for a game, a collection or a selection (Automatic follows the global choice). The global "Slot: auto" is gone: the slot is Bottom Slot unless you pick Side Slot.
- **Panel:** one **Animations** section (slot, game-logo timing and sounds first, then Insert and Eject with their speeds and previews); **Global Settings** (was "3D case options") with Bands, Frames, Wear, Default Wear and Varying Box Thickness; **Case & Disc/Cartridge** above **Disc and Cartridge Print**; *Tilt of focused game* moved into Effects; the self-check buttons moved to Tools; "Looks, colors and presets" is now **Configuration**; most subtexts removed; capitalization and spelling of many labels (Jewel Case, Big Box, Sealed, Box Thickness, Cover (Fill), Cover (Fit), Full Motion, Less Battery, Less Motion, Neighbors lean away, Pick up selected game, ...).

### Print per game, art window color, preset names
- **Disc/Cartridge print** can be set per game, collection or selection (Automatic, Logo, Cover, Whole cover, None) in *Looks, colors and presets*; the Quick Access panel keeps the default for everything else. **Logo** comes first and is the default now (a game without a logo gets its whole cover); the old default, Cover, is replaced by Logo once.
- **Art window color** (cartridges only), per game or collection: the color behind the logo, the whole cover or when nothing is printed, separate from the cartridge's own color. Automatic is a dark backdrop, whatever color the cartridge is (changing the cartridge's color does not change the window), so you can have a green cartridge with a blue window. A disc is one color, so the print simply goes over it. The previews show the print and the window.
- **Presets:** *Dark Blue (Steam)* is now just **Steam**, and *Black* is **PS2**, placed between PS1/PS3 and PS4/PS5. Saved looks follow (the old Black, and an old PS2 look, are PS2).

### Cartridges, thickness and settings clean-up
- **SNES and N64** cartridges now go only part of the way into the slot and stay there, the way they sit in the real console. Eject slides them back out. (The NES cartridge still goes all the way in.)
- **Switch cartridge**: smaller (about the size of a DS card), taller and with the red band, the black number strip, the notch and the arrow of the real card; the cut-off upper-right corner is gone.
- **GBA cartridge** is darker. **DS** cartridge: the label window fills much more of it and has a small slanted cut in its lower-left corner; the **3DS** has the same slant.
- The Switch case is as thick as the jewel case (it was 30%; see the later change below).
- The setting **3D cases on Home and game pages** was removed (it never did anything); **Enabled** turns the 3D cases on or off everywhere.
- **Bands** and **Frames** are the names of the global switches now (and of the per-game ones): off removes them completely.
- **Automatic** has a row of its own above the Disc Presets and Cartridge Presets.
- **Thickness**: one choice for where it starts (Automatic, Standard (DVD case), Varies with the preset: only one is highlighted) and a separate percentage adjustment (Thinnest, Thin, Thick, Thickest, or the slider), with an explanation of each. "Remove the adjustment" appears once you adjust.
- **Frame without a band**: with the band off the frame is an even border all round and the art grows to fill the space the band used to take (it used to leave an empty strip at the top). The preview shows it too.
- **Default wear** is in the Quick Access panel, under *Wear* (it was on the old Colors tab).

### Restructured: global switches, per-item overrides, new presets
- **One rule everywhere.** The global switches are: insert animation, eject animation, 3D cases (one switch, Enabled), and under 3D cases colored bands, colored frames, wear and varying box thickness. A collection or a game can have the same ones, and when its own differs from the global one it wins (game over collection over global). The global switches in turn win over what a preset brings along: with bands off, a preset still gives its frame but no band; with box thickness set to standard, a preset keeps everything except its thickness.
- **Per game and per collection** you can now also set: frame on or off, band color, frame color, insert animation on or off, eject animation on or off, and standard or varying thickness. Everything is kept in one place (`gameOv` / `collOv`) instead of a dozen separate lists; your earlier per-game and per-collection settings are carried over when the plugin starts.
- **New presets, all known consoles** (each with its own case, band color, frame color, disc or cartridge and box thickness), in two sections. *Disc Presets*: Steam, GCN, Wii, Wii U, PS1/PS3, PS2, PS4/PS5, Xbox, Xbox 360, Xbox One/Series, with Automatic in a row of its own above them. *Cartridge Presets*: NES, SNES, N64, GB, GBC, GBA, DS, 3DS, Switch. **Steam** is the default look. Old looks that are one of these consoles carry over (White became Wii, Wii U cyan became Wii U, PS1 and PS3 became PS1/PS3, PS4 and PS5 became PS4/PS5, and so on). Looks that are not in the list are gone (Gold, Red, Blue, Gray, Black frame/white band, PS2, PSP, Dreamcast, Sega, PC big box): whatever used one goes back to Automatic. The old default, Black, is replaced by Steam once. To keep an old look, make it a preset of your own.
- **Disc color.** Discs have a color now too (it tints the hub ring and what is under the art; fully visible with *Whole cover*, *Logo* or *None* printing). GCN and Xbox discs are black by default, Wii U and Xbox 360 white. Set it per game or collection under *Disc/Cartridge color*.
- **Removed**: *Adjust a built-in look* (a global edit of a built-in preset; per-collection and per-game band and frame colors replace it, and your own presets are the way to keep a custom look).
- **Previews.** *Looks, colors and presets* shows a still preview of the case (with band, frame, thickness and wear) and of its disc or cartridge, and it stays in view while you scroll the settings. The same preview is in the preset editor.
- **Sliders start where the color is.** The color sliders open on the color currently in use, not on a fixed one.
- **Speed sliders.** Insert speed and eject speed are two sliders (50% to 300%, in steps of 50%) instead of buttons.
- **Left and right bumpers** switch between the Games, Collections and Presets tabs (Steam's own tab bar). The old Colors tab is now **Presets**: the default preset, your own presets and the templates. Pressing **B** inside a game's, collection's or preset's settings goes back to the tabs (like the Back button) instead of leaving the page.
- *Case shape* is now *Case & Disc/Cartridge*, and colour is spelled color throughout.
- **Animations** can be switched on or off per game or collection, independent of the 3D case; the preview buttons always play.

### Leaning neighbours: hide the box or settle flat
- A new choice under the neighbour lean slider: **Hide its box at once** (the game you left leans straight away, its box disappearing right away and the cover turning alone) or **Settle flat first** (the old behavior: it settles flat, pauses, then leans).

### Thickness per collection and per game (new)
- A game, a collection or a bulk selection has **Thickness** in *Looks, colors and presets*: **Automatic** (the case's normal thickness: the *Case thickness* setting times the shape's own factor, as before), **Standard (DVD case)** or **Varies with the preset**, plus percentages (Thinnest 50%, Thin 75%, Thick 150%, Thickest 200%) or a slider from 25% to 300%. The percentage is relative to the normal thickness, so a Switch card set to 200% is still thinner than a big box. Order: the game's own thickness, then its collection's, then normal. The shelf's case follows it; the insert and eject animation keeps its own size.

### Rounded corners all the way round the box
- The spine now bends along the front's rounded corner into the top and the bottom, instead of running straight up to a sharp corner. The same goes for the right side, and the back is rounded like the front. Each corner is a small piece of the box built from two flat strips as deep as the case; the spine's band carries on round the top corners. The corner radius is the same as the front's, so it follows the *Plastic sleeve and rounded corners* setting and the case shape.

### SteamGridDB plugin
- Pictures from SteamGridDB (the artwork picker of the SteamGridDB plugin) are never turned into cases, so browsing its catalogue of covers shows them exactly as they are. Wide capsules, heroes, logos and icons were never affected. If a SteamGridDB picture still turns into a case for you, please report it.

### Looks, colors and presets lists
- A game's, collection's or preset's name is now always in the exact middle of its row; the look, shape and other settings on the right no longer push it sideways. Long statuses wrap to two lines.
- The *Cartridge color* text no longer gives game examples; it says a color can be set for individual games, and that a game's own color wins over its collection's.

### Case shape per collection and per game (new)
- The shape no longer has to come from the look or be forced for everything. In *Looks, colors and presets*, a collection, a game or a bulk selection has its own **Case shape** next to its look and wear. Example: give your Switch collection the Switch card and leave the rest on keepcases, whatever color each has.
- Order: the game's own shape, then its collection's, then the shape set for all games, then the look's own shape.

### Cartridges (new)
- Shapes, in this order: **NES, SNES, N64, Game Boy, Game Boy Color, GBA, DS, 3DS, Switch**. On the shelf they change the case's depth and corners; in the insert and eject animation a matching cartridge goes into the slot, with its own outline, label area and contacts. The DS is the dark one with softly rounded corners; the 3DS is the light gray one with the tab at its upper right. The Switch card is the plugin's existing cartridge case, now labelled **Switch** (the red *Switch* look still picks it automatically; saved shapes keep working). The shapes are stylised, not exact moulds.
- **GameCube** shape: a keepcase whose disc is a smaller mini disc (and the empty ring in the tray shrinks with it).

### Cartridge color per game and per collection (new)
- A game, a collection or a bulk selection has a **Cartridge color**: 12 presets (yellow for Donkey Kong 64, green for Pokémon Emerald, gold, clear blue...) plus Hue, Saturation and Lightness sliders. Automatic keeps the console's own color. It colors the cartridge in the animation; the case on your shelf keeps its look's color. Order: the game's color, then its collection's, then the console's.

### 3D off per game and per collection (new)
- Each game, collection or bulk selection has **3D case and animation**: *Automatic*, *Off* (a plain cover, no 3D case, no insert or eject animation) or, for a game, *On* (3D even if its collection is off). The game's own switch wins over its collection's.

### What is printed on the disc or cartridge (new)
- **Cover** (as before, cropped to fill), **Whole cover** (the entire cover fitted on a blurred copy of itself, so nothing is cut off), **Logo** (the game's logo on a dark ground; a game without a logo gets the whole cover) or **None** (plain, in the case color). Under *Insert animation*.

### Insert and eject speed (new)
- 0.5x, 1x, 1.5x, 2x or 3x for the whole animation, sounds included. Separate from the Calm / Normal / Snappy speed of the shelf. A faster animation finishes before a game that boots quickly covers it.

### Band as a frame, and band and frame colors (new)
- *Band as a frame* (under *Color band on top*): instead of covering the top of the art, the art shrinks a little and the band color fills the space around it. Template frames are left alone.
- *Colors → Band and frame colors*: for any look, set the **band color** and the **frame color** separately (presets or sliders), for example a black frame with a white band. Without a frame color of its own, the frame matches the band, so nothing changes until you set one.

### Removed looks
- **Wee white** (the Wii look) is gone: its band color was wrong, and plain **White** does it correctly. Games and collections that used it now use White, and a collection named after the Wii gets White.
- **PlayCube purple** (the GameCube look) is gone: GameCube games have no purple band. Games and collections that used it go back to Automatic. Use the new GameCube shape with any look instead.

### Renamed to 3D Game Cases
- The plugin is now called **3D Game Cases** (it was *Finally 3D Game Cases*): Quick Access title, settings page, reports and the release zip (`3D-Game-Cases-v1.12.0.zip`). The install folder (`3d-game-cases`), your saved settings and the safe-mode path are unchanged. After installing, restart Steam (or run `sudo systemctl restart plugin_loader`); if the old *Finally 3D Game Cases* entry still shows in Decky's plugin list, remove it.

### Redrawn cartridge shapes
- **Game Boy and Game Boy Color are separate shapes now.** Game Boy is the light gray cartridge with the notch in its upper-right corner; Game Boy Color is the darker, see-through one with no notch, where the circuit board shows through the plastic. A shape you saved as *GB / GBC* becomes Game Boy.
- **SNES**: a wide, flat cartridge with the raised label tab on top, the grooved ears on both sides and the slot below the label (it used to be a narrower body with a stepped bottom).
- **DS**: the slanted cut-off at the upper-right corner is gone; all four corners are softly rounded, the lower-left one a little more.
- **GBA**: a wider top band with the little nubs at the upper corners, a slightly narrower body, rounded top corners and a flat bottom. The label sits below the band.
- **N64**: a rounded, domed top with straight sides and a flat bottom. The label is taller, like the real one.
- **NES**: taller (about 1.16 times as high as wide), still stepping in at the connector end, now with the ridged grip panel on the left and the label on the right.

### Fixed
- The last wear options in *Looks, colors and presets* were hidden behind the footer when scrolled to the bottom.
- The d-pad can move left and right inside rows of buttons (the tabs, looks, shapes, colors, wear and the Quick Access button groups); before, "right" did nothing and you had to press down to reach the next option.
- The *Looks, colors and presets* page now ends above Steam's footer, so the last row can be scrolled fully into view.

### Collection names no longer pick a look
- The plugin no longer guesses a look from a collection's name (PS2, Xbox 360, Switch, Wii U...), and the *Guess look from collection name* switch is gone. A game now gets its own look, else its collection's look, else the default look. Games that were getting a guessed look now use the default look until you pick one.

### Color band per game and per collection (new)
- Press a game or a collection under *Looks, colors and presets* and pick **Color band**: **Automatic** (follows *Color band on top*), **Band** or **No band**. So you can turn the band off for just some games or collections, or keep it off everywhere and turn it on for the ones you choose. A game's own setting beats its collection's, which beats the global switch.
- The band is now left off the spine too when a case has no band (before, the spine always had one, even with *Color band on top* off).
- *Band as a frame* follows each case: a case with no band gets no frame. Its switch stays visible when the global band is off but some game or collection has a band.

### Small changes
- The **Console names** section is gone from the Colors tab. The red look is called **Red** and the cyan look **Wii U cyan**; names you typed before are no longer used.
- New look **Steam dark blue**: the colors of *PC big box (Steam blue)*, but with the thickness of whichever case shape is chosen instead of always the big box.
- NES, SNES, N64, Game Boy, Game Boy Color, GBA and the big box are all 2.0x the thickness slider.
- **Neighbours lean away** now finds the games beside the one you are on by their position instead of by how Steam nests the tiles, so they lean no matter how the row is built. The game you just left settles flat first and only then leans, so its box never shows the wrong side.
- Choosing a look for a game or a collection no longer sends you back to the list; the page stays open like its other sections.
- The shape buttons say **GB**, **GBC** and **GCN** (they were Game Boy, Game Boy Color and GameCube).
- The red look is called **Red** (it was *Switch red*).

### Icon
- The plugin's icon is a narrower cube, drawn in true isometric proportion; the old one looked stretched wide.

### Presets (changed)
- *Colors → My colors* is now **My presets**: **New preset** opens an editor where you name the preset, choose its color, and give it a band color and a frame color of its own. A preset is a look of its own, so a black frame with a white band no longer has to overwrite a built-in look. The old *Band and frame colors* list is now *Adjust a built-in look* and only covers the built-in looks. Band and frame colors you had set on one of your own colors move into that preset. Up to 24 presets.
- Four new looks: **Black frame, white band**, **Wii U cyan frame, white band**, **Xbox dark green, black band** and **Xbox 360 green, white band**. The frame shows around the art with *Band as a frame* (Effects).
- The case shapes are listed with **GameCube between GBA and DS**.
- **Thickness**: NES, SNES, N64, Game Boy, Game Boy Color and GBA are as thick as the big box (the thickest case), the DS and 3DS cases are as thick as a regular DVD case (like the keepcase and GameCube), and the Switch card is the thinnest.

## 1.11.1
### Near-zero cost
- **Resting covers are flat now.** Before, every cover on screen was a full 3D object with its own GPU layers (in a 36-game Home row: 210 promoted elements and 70 3D overlay layers on top of Steam's own). Now resting covers are plain 2D paint with the same look (gloss, band, sleeve, wear, shadow): 0 extra layers. Only the game you are on becomes 3D, and it stays 3D until it has turned back, so the turn in and out look the same as before.
- **Nothing animates forever.** The gentle drift used to loop endlessly on the game you are on; it now plays two slow cycles and stops.
- **Sleeps while you play.** While a game is running the plugin stops watching Steam's pages, stops its timer and pauses its animations; when the game closes it catches up with one scan.
- Removed an invisible spine layer that every cover carried.

### Fixed
- **Insert and eject animations showed a plain black case and disc with the 3D cases switched off.** The animation took its art from the 3D-tagged cover, and with 3D off nothing is tagged; the fallback asked Steam for the art and gave up after 0.6 s. It now finds the game's cover on screen by itself, and otherwise tries Steam's art, your custom art (`customimages`) and Steam's standard cover address all at once, taking the best one that loads within 1.5 s.

## 1.11.0
### Eject animation (new, its own switch)
- When you quit a game, the case flies out and opens, the disc (or game card) comes back out of the slot, drops into its tray, and the case closes and flies back to its place. Its own switch under *Insert animation*, with a **Preview the eject** button; it works without the insert animation too.
- Sounds: the case opens, the drive spins down and pushes the disc out, it drops into the tray, the case shuts.
- Waits until Steam's window is back after the game closes (up to 8 seconds).

### Shrink-wrap tear on first launch (new)
- A sealed game (never played, or set to *Sealed* itself) gets its shrink-wrap torn off when you launch it: the glossy wrap with the gold seal is gripped, ripped in two and the pieces fly off, then the case opens as usual. With crinkle and rip sounds.
- A game you set to *Sealed* yourself switches to normal wear after that. Games sealed because they were never played switch on their own once Steam has played them.

### Less motion (new)
- *Full motion*, *Less on battery* or *Less motion* (Effects). Less motion turns off the drifting, the foil shine and the leaning neighbours. The covers stay 3D.
- *Less on battery* follows Steam's charger state and switches back when you plug in.

### Other
- The insert and eject animations no longer start in a window that isn't laid out yet; the eject tries again a moment later.
- `npm test` also checks the less-motion settings.

## 1.10.3
- **Fixed the insert animation sometimes playing twice.** Steam reports a launch twice: when you press Play, and again when the game is actually running. The second report was ignored only for 15 seconds, so when Steam Cloud sync (or a cloud conflict dialog that restarts the launch) took longer, the animation played again. Now each launch plays it once, until that game has exited. Pressing Play again after closing or cancelling still plays it.
- `npm test` replays Steam's launch reports (cloud sync delay, restarted launch, relaunch...) and checks the animation plays exactly once per launch.

## 1.10.2
Update from 1.9.0: install the new zip the same way as before. It replaces the old version and keeps all your looks, wears, names and settings.

### Fixed: huge, blocky ghost with a white ring around the focused game on Home
- Steam's Home draws every cover twice: the real cover inside the tile you move onto (a role=link Focusable), and a blurred glow copy in a box right next to it, outside that tile. Steam's class names are scrambled now, so the plugin no longer recognised the copy and turned it into a case too. On focus that copy was tilted, un-blurred and drawn on top of the real cover.
- The copy is now recognised by where it sits (same picture, next to the cover, outside Steam's focus target), is never turned into a case, and keeps Steam's own glow. When two copies can't be told apart, both are kept, so the real cover is never dropped.
- Works whichever of the two Steam creates first, and when Steam re-creates them. On Home the panel now shows about as many "glow/reflection copies left alone" as covers.

### Template frames (new)
- Use printed console frames instead of plain colors. Put frame pictures (PNG, WebP or JPG, 2:3, for example the SteamGridDB collection "Templates" by MANE0395) in `~/homebrew/settings/3d-game-cases/templates/` and press **Reload templates** (Looks, colors and presets → Colors → Templates).
- Every picture appears as a look next to the colors and can be set as the default, per collection or per game. The game's own cover art is drawn inside the frame's window and the frame over it, on the resting cover and on the 3D case.
- The window is found automatically. If one is off, add `<same name>.json` next to the picture, for example `{"window":[0.04,0.11,0.04,0.04]}` (left, top, right, bottom, as fractions of the frame).
- Nothing is downloaded or included in the plugin; only files you put in that folder are used. Works with the fallback injection too.

### Other
- The tilt no longer picks up a strong perspective that Steam sets on a parent (it could magnify the case); the plugin sets its own. Very wide items get a slightly smaller tilt.
- Covers whose tilting item is the cover itself keep their gloss, band and sleeve.

## 1.9.0
Update from 1.8.2: install the new zip the same way you installed 1.8.2. It replaces the old version and keeps all your looks, wears, names and settings.

### Insert animation (new, with its own switch)
- **Its own section and switch** in the panel; it works with the 3D cases switched off.
- Plays the moment you press **Play**, in the library or on a game page.
- The case flies out with a little overshoot, a light sweeps across the cover, and it opens on its hinge with a soft glow in the game's color behind it.
- The disc (or a game card for cartridge looks) is printed with the game's cover art (your custom art first, then Steam's) and is already in the tray when the case opens. It lifts with a wobble, swings along an arc, spins up and is pulled into the slot, which sits in a bezel and lights up, with a small jolt when it clicks. Then the case snaps shut and flies back to its place.
- **Timing:** *Before game logo* (covers the screen, Steam's logo shows after it) or *After game logo* (Steam's logo first, then the animation, before Steam's small loading animation).
- **Insert sounds:** the case clicks open, the disc lifts, slides into the slot, the drive spins up, the case snaps shut. Made with Web Audio, no sound files.
- Self-check: new "Play button seen" line.

## 1.8.2
- Renamed to **Finally 3D Game Cases**.
- Steam's focus outline is never cut by the case or its shadow any more.
- Fixed the emergency safe-mode path in the panel and README (`~/homebrew/settings/3d-game-cases/SAFE_MODE`).

## 1.8.1
- Fixed a one-frame dark flicker over the selected cover (cover and background shared one depth plane).

## 1.8.0
- Plastic sleeve edge and rounded keepcase corners.
- Pick-up animation when you open a game.
- Neighbouring games lean away, like books on a shelf.
- Animation speed: Calm / Normal / Snappy.
- Self-check lists other themes and warns when they also change the cases.

## 1.7.x
- Smooth turn in and out; the spine name was removed.
- The case stays inside its own slot (hinges on its right edge).
- Built against Valve's current Steam UI: the glow copy is left alone, Steam's focus lift and perspective are replaced, the 3D is never flattened.
- First-run self-check, saved reports in `~/Downloads`, fallback injection through Steam's debug port, safe mode, per-game wear.

## 1.6 and earlier
- Per-game and per-collection looks, 21 console presets, custom colors, case shapes, wear (also from playtime), bulk assign, editable console names, experimental launch animation, non-Steam game support.
