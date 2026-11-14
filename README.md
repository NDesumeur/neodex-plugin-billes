# Billes

Le solitaire, le casse-tête de billes sur un plateau troué : à chaque coup, une bille saute par-dessus sa voisine et la fait sortir. Il faut finir avec une seule bille, et sur la case dorée pour une partie parfaite.

*English version: [README.en.md](README.en.md)*

## Comment jouer

1. Clique sur une bille de verre : elle se soulève, et les trous où elle peut arriver s'allument en jaune.
2. Clique sur un de ces trous : la bille saute en arc par-dessus sa voisine, et la bille sautée roule jusqu'à la rigole qui fait le tour du plateau en bois. Les billes sorties s'y rangent.
3. La partie s'arrête quand plus aucun saut n'est possible.

- **Retour** ou **Ctrl+Z** annule le dernier saut, sans limite, même après la fin de la partie.
- En haut, le compteur montre les billes restantes, et l'**indicateur** dit en direct si tu peux encore finir avec une seule bille (« UNE BILLE POSSIBLE ») ou si ce n'est plus possible. Il est calculé par un solveur : il ne se trompe pas.
- **Nouvelle partie** remet le plateau à zéro ; un clic après la fin relance aussi.

## Les plateaux

Choisis-le dans la liste. Chacun part d'un trou vide choisi pour qu'une fin à une seule bille soit toujours possible, et la case dorée marque où finir pour un parfait.

- **Croix anglaise** : 33 trous, 32 billes, départ et arrivée au centre. Le classique.
- **Croix française** : 37 trous, avec quatre trous de plus dans les angles. Au centre, elle ne se finit jamais avec une bille : elle part donc d'un trou du haut.
- **Petite croix** : 21 billes, pour apprendre.
- **Pyramide** : 15 billes en triangle ; ici on saute aussi en diagonale, le long des côtés du triangle.
- **Asymétrique** : 39 trous, une croix aux bras inégaux.

## Les énigmes

L'onglet **Énigmes** propose 30 énigmes : quelques billes déjà placées, et une case dorée où finir avec la dernière bille. Elles vont de quelques sauts à plus de vingt, sur sept plateaux (les cinq ci-dessus, la croix allemande, le losange et le grand triangle). Chacune a au moins une solution.

- **3 étoiles** : réussie sans annuler ; **2 étoiles** : avec trois retours au plus ; **1 étoile** : réussie quand même.
- Une énigme s'ouvre quand la précédente est réussie.

## Statistiques

Le panneau Records montre ton **record** sur le plateau choisi (le moins de billes laissées), tes **réussites** (parties finies avec une seule bille), tes **parfaits**, tes énigmes réussies et tes étoiles.

## Données et synchronisation

Tes records, réussites et étoiles sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Billes → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
