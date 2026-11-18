# vit

Repozytorium połączone z https://github.com/vitcortel/vit.

Folder projektu na tym komputerze: `D:\github\vit`.

## Zagraj w klocki

Otwórz plik `index.html` w przeglądarce i kliknij **Zagraj teraz**.
Nie trzeba nic instalować ani uruchamiać serwera. Gra korzysta z HTML, CSS i JavaScript.
Strzałki przesuwają i obracają klocki, spacja zrzuca klocek, a **P** włącza pauzę.
Na telefonie i myszą można używać przycisków pod planszą.

- `index.html` — ekran gry i przyciski.
- `style.css` — kolory, układ i wersja mobilna.
- `game.js` — spadające klocki, linie, punkty, poziomy i rekord na tym urządzeniu.

### Nauka GitHuba na tej grze

1. W **History** pierwszy commit przygotowuje repozytorium, a kolejny dodaje grę.
2. Otwórz `index.html` w edytorze i zmień tekst nagłówka. Zapisz plik.
3. W **Changes** GitHub Desktop pokaże dokładnie usunięty i dodany tekst.
4. Wpisz opis `Zmień tytuł gry` i kliknij **Commit to main**.
5. Kliknij **Push origin**. Na stronie repozytorium pojawi się nowa wersja oraz jej historia.

GitHub przechowuje kod. Do grania online można osobno włączyć **GitHub Pages**:
w ustawieniach repozytorium wybierz **Pages → Deploy from a branch → main → /(root)**.
Ta konfiguracja nie jest wymagana do grania na komputerze.

## Co jest czym?

- **Git** zapisuje historię kolejnych wersji plików na komputerze.
- **GitHub** przechowuje wysłaną kopię projektu w internecie.
- **GitHub Desktop** pozwala obsługiwać Git i GitHub przyciskami.
- **Repozytorium** to folder projektu wraz z historią zmian.
- **Commit** to zapis wybranych zmian w lokalnej historii, z krótkim opisem.
- **Push** wysyła zapisane commity na GitHuba.
- **Fetch** sprawdza, czy na GitHubie pojawiły się nowe zmiany.
- **Pull** pobiera je i włącza do lokalnej gałęzi.
- **Branch** to gałąź, czyli osobny tor pracy. Główna gałąź tutaj to `main`.
- **origin** to skrót adresu tego repozytorium na GitHubie.

Zapisanie pliku, commit i push to trzy osobne czynności.

## Codzienna praca w GitHub Desktop

1. Wybierz repozytorium **vit** w lewym górnym rogu.
2. Przed pracą kliknij **Fetch origin**. Jeśli pojawi się **Pull origin**, pobierz zmiany.
3. Edytuj pliki w `D:\github\vit` i zapisz je w edytorze.
4. W zakładce **Changes** sprawdź listę plików i podgląd zmian. Zaznaczone pliki trafią do commita.
5. W polu **Summary** wpisz krótki opis, np. `Dodaj stronę główną`.
6. Kliknij **Commit to main** (lub przycisk z nazwą aktywnej gałęzi).
7. Kliknij **Push origin**, żeby wysłać commity na GitHuba. Przy pierwszym wysłaniu aplikacja może pokazać **Publish branch**.
8. **View on GitHub** otwiera kopię w internecie, a **History** pokazuje zapisane commity.

## Pierwsze wysłanie

Początkowy commit zawiera tę instrukcję, `.gitignore` i `.gitattributes`.
Po lokalnej konfiguracji możesz wysłać go przyciskiem **Push origin** albo **Publish branch**.

## Większa zmiana

W menu **Branch → New branch** utwórz gałąź, np. `dodaj-kontakt`.
Zapisuj tam commity i wyślij gałąź. Następnie utwórz **Pull Request** na GitHubie:
to podgląd i propozycja połączenia zmian z `main`.

## Co można zapisywać?

Kod, dokumentację i nieduże pliki projektu. `.gitignore` pomija lokalne pliki
`.env`, niektóre klucze oraz popularne foldery plików tymczasowych i zależności.
Nie wykrywa jednak wszystkich sekretów: przed commitem sprawdzaj zawartość plików.
Nie zapisuj haseł ani tokenów w kodzie. Usunięcie sekretu z pliku nie usuwa go ze starszych commitów.
Surowe nagrania wideo i inne duże materiały lepiej przechowywać osobno.

## Pomocne zasady

- Jeden projekt trzymaj w jednym repozytorium.
- Rób małe commity opisujące konkretną zmianę.
- Pliki są na GitHubie dopiero po udanym **Push**.
- Widoczność public/private sprawdza się na stronie repozytorium; sama konfiguracja lokalna jej nie zmienia.
- Nie usuwaj folderu `.git`: przechowuje lokalną historię i ustawienia.
- Jeśli pojawi się konflikt, zatrzymaj się i poproś o pomoc przed odrzucaniem zmian.

Oficjalna instrukcja: https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop
